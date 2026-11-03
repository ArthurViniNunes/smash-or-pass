import {
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { IMAGE_QUEUE, withImageChannel } from "./rabbitmq";
import { env } from "../config/env";

export interface ImageProcessingJob {
  bucket: string;
  key: string;
  mimeType: string;
}

export class ImageProcessingQueue {
  private readonly client?: SQSClient;
  private readonly queueUrl?: string;

  constructor() {
    if (env.RABBITMQ_URL) return;

    if (!env.AWS_SQS_IMAGE_QUEUE_URL) {
      throw new Error(
        "AWS_SQS_IMAGE_QUEUE_URL is required when STORAGE_PROVIDER=s3."
      );
    }

    this.queueUrl = env.AWS_SQS_IMAGE_QUEUE_URL;

    this.client = new SQSClient({
      region: env.AWS_REGION,
    });
  }

  async enqueue(job: ImageProcessingJob): Promise<void> {
    if (env.RABBITMQ_URL) {
      await withImageChannel(env.RABBITMQ_URL, async (channel) => {
        channel.sendToQueue(IMAGE_QUEUE, Buffer.from(JSON.stringify(job)), { persistent: true });
        await channel.waitForConfirms();
      });
      return;
    }

    await this.client?.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(job),
      })
    );
  }
}