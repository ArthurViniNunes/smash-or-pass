import type {
  StoredFile,
  UploadFile,
  UploadFolder,
} from "./types";

export interface StorageProvider {
  save(
    file: UploadFile,
    folder: UploadFolder,
  ): Promise<StoredFile>;

  delete(fileUrl: string): Promise<void>;
}