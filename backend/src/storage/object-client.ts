import { S3Client } from "@aws-sdk/client-s3";

import { env } from "../config/env";

export function createObjectClient(): S3Client {
  const { MINIO_ENDPOINT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD } = env;

  if (!MINIO_ENDPOINT) return new S3Client({ region: env.AWS_REGION });
  if (!MINIO_ROOT_USER || !MINIO_ROOT_PASSWORD) {
    throw new Error("MinIO credentials are required when MINIO_ENDPOINT is set.");
  }

  return new S3Client({
    region: "us-east-1",
    endpoint: MINIO_ENDPOINT,
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: MINIO_ROOT_USER,
      secretAccessKey: MINIO_ROOT_PASSWORD,
    },
  });
}
