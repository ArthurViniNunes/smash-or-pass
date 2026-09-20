import { env } from "../config/env";
import { CloudinaryStorageProvider } from "./cloudinary-storage-provider";
import { LocalStorageProvider } from "./local-storage-provider";
import { S3StorageProvider } from "./s3-storage-provider";
import type { StorageProvider } from "./storage-provider";

export function createStorageProvider(): StorageProvider {
  if (env.STORAGE_PROVIDER === "cloudinary") {
    return new CloudinaryStorageProvider();
  }

  if (env.STORAGE_PROVIDER === "s3") {
    return new S3StorageProvider();
  }

  return new LocalStorageProvider();
}