import {
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { env } from "../config/env";

export interface ImageProcessingJob {
  bucket: string;
  key: string;
  mimeType: string;
}

export class ImageProcessingQueue {
  private readonly client: SQSClient;
  private readonly queueUrl: string;

  constructor() {
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
    await this.client.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(job),
      })
    );
  }
}