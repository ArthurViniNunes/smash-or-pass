import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "../config/env";
import { ImageProcessingQueue } from "../queue/image-processing-queue";
import type { StorageProvider } from "./storage-provider";
import type {
  StoredFile,
  UploadFile,
  UploadFolder,
} from "./types";

const FILE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;
  private readonly queue: ImageProcessingQueue;
  private readonly bucket: string;

  constructor() {
    if (!env.AWS_S3_BUCKET) {
      throw new Error(
        "AWS_S3_BUCKET is required when STORAGE_PROVIDER=s3."
      );
    }

    this.bucket = env.AWS_S3_BUCKET;

    this.client = new S3Client({
      region: env.AWS_REGION,
    });

    this.queue = new ImageProcessingQueue();
  }

  async save(
    file: UploadFile,
    folder: UploadFolder
  ): Promise<StoredFile> {
    const extension =
      FILE_EXTENSIONS[file.mimeType] ?? "bin";

    const filename = `${randomUUID()}.${extension}`;
    const key = `smash-or-pass/${folder}/${filename}`;

    let uploaded = false;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimeType,
          Metadata: {
            processed: "false",
          },
        })
      );

      uploaded = true;

      await this.queue.enqueue({
        bucket: this.bucket,
        key,
        mimeType: file.mimeType,
      });
    } catch (error) {
      if (uploaded) {
        await this.removeByKey(key).catch((cleanupError) => {
          console.error(
            "Failed to remove an orphaned S3 object:",
            cleanupError
          );
        });
      }

      throw error;
    }

    return {
      filename,
      url: this.buildPublicUrl(key),
    };
  }

  async delete(fileUrl: string): Promise<void> {
    const key = this.extractKey(fileUrl);

    if (!key) {
      return;
    }

    await this.removeByKey(key);
  }

  private async removeByKey(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  private buildPublicUrl(key: string): string {
    const encodedKey = key
      .split("/")
      .map(encodeURIComponent)
      .join("/");

    return (
      `https://${this.bucket}.s3.${env.AWS_REGION}` +
      `.amazonaws.com/${encodedKey}`
    );
  }

  private extractKey(fileUrl: string): string | null {
    try {
      const parsedUrl = new URL(fileUrl);

      const expectedHost =
        `${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com`;

      if (parsedUrl.hostname !== expectedHost) {
        return null;
      }

      return decodeURIComponent(
        parsedUrl.pathname.replace(/^\/+/, "")
      );
    } catch {
      return null;
    }
  }
}