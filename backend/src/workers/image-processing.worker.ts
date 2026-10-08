import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import {
  DeleteMessageCommand,
  type Message,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import sharp from "sharp";

import { env } from "../config/env";
import type {
  ImageProcessingJob,
} from "../queue/image-processing-queue";

const POLLING_WAIT_SECONDS = 20;
const VISIBILITY_TIMEOUT_SECONDS = 60;
const RETRY_DELAY_MILLISECONDS = 3000;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function parseJob(body?: string): ImageProcessingJob {
  if (!body) {
    throw new Error("SQS message does not contain a body.");
  }

  const value: unknown = JSON.parse(body);

  if (
    typeof value !== "object" ||
    value === null ||
    !("bucket" in value) ||
    !("key" in value) ||
    !("mimeType" in value) ||
    typeof value.bucket !== "string" ||
    typeof value.key !== "string" ||
    typeof value.mimeType !== "string"
  ) {
    throw new Error("Invalid image processing message.");
  }

  return {
    bucket: value.bucket,
    key: value.key,
    mimeType: value.mimeType,
  };
}

class ImageProcessingWorker {
  private readonly s3: S3Client;
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;
  private running = true;

  constructor() {
    if (!env.AWS_SQS_IMAGE_QUEUE_URL) {
      throw new Error(
        "AWS_SQS_IMAGE_QUEUE_URL is required by the image worker."
      );
    }

    this.queueUrl = env.AWS_SQS_IMAGE_QUEUE_URL;

    this.s3 = new S3Client({
      region: env.AWS_REGION,
    });

    this.sqs = new SQSClient({
      region: env.AWS_REGION,
    });
  }

  stop(): void {
    this.running = false;
  }

  async start(): Promise<void> {
    console.log("Image processing worker started.");

    while (this.running) {
      try {
        const response = await this.sqs.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: POLLING_WAIT_SECONDS,
            VisibilityTimeout: VISIBILITY_TIMEOUT_SECONDS,
          })
        );

        for (const message of response.Messages ?? []) {
          await this.handleMessage(message);
        }
      } catch (error) {
        console.error("Image worker polling failed:", error);

        if (this.running) {
          await delay(RETRY_DELAY_MILLISECONDS);
        }
      }
    }

    console.log("Image processing worker stopped.");
  }

  private async handleMessage(message: Message): Promise<void> {
    if (!message.ReceiptHandle) {
      throw new Error("SQS message does not have a receipt handle.");
    }

    const job = parseJob(message.Body);

    await this.processImage(job);

    await this.sqs.send(
      new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      })
    );

    console.log(`Processed S3 image: ${job.key}`);
  }

  private async processImage(
    job: ImageProcessingJob
  ): Promise<void> {
    const object = await this.s3.send(
      new GetObjectCommand({
        Bucket: job.bucket,
        Key: job.key,
      })
    );

    if (object.Metadata?.processed === "true") {
      return;
    }

    if (!object.Body) {
      throw new Error(`S3 object has no body: ${job.key}`);
    }

    const bytes = await object.Body.transformToByteArray();
    const originalBuffer = Buffer.from(bytes);

    const processedBuffer = await this.transformImage(
      originalBuffer,
      job.mimeType
    );

    await this.s3.send(
      new PutObjectCommand({
        Bucket: job.bucket,
        Key: job.key,
        Body: processedBuffer,
        ContentType: job.mimeType,
        Metadata: {
          processed: "true",
        },
      })
    );
  }

  private transformImage(
    buffer: Buffer,
    mimeType: string
  ): Promise<Buffer> {
    const image = sharp(buffer)
      .rotate()
      .resize({
        width: 1024,
        height: 1024,
        fit: "inside",
        withoutEnlargement: true,
      });

    switch (mimeType) {
      case "image/jpeg":
        return image
          .jpeg({
            quality: 80,
            mozjpeg: true,
          })
          .toBuffer();

      case "image/png":
        return image
          .png({
            compressionLevel: 9,
          })
          .toBuffer();

      case "image/webp":
        return image
          .webp({
            quality: 80,
          })
          .toBuffer();

      default:
        throw new Error(
          `Unsupported image MIME type: ${mimeType}`
        );
    }
  }
}

const worker = new ImageProcessingWorker();

process.on("SIGINT", () => {
  worker.stop();
});

process.on("SIGTERM", () => {
  worker.stop();
});

worker.start().catch((error) => {
  console.error("Image processing worker stopped unexpectedly:", error);
  process.exitCode = 1;
});