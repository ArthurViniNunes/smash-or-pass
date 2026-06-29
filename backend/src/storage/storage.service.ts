import type { StorageProvider } from "./storage-provider";
import type {
  StoredFile,
  UploadFile,
  UploadFolder,
} from "./types";

export class StorageService {
  constructor(
    private readonly provider: StorageProvider,
  ) {}

  async upload(
    file: UploadFile,
    folder: UploadFolder,
  ): Promise<StoredFile> {
    return this.provider.save(file, folder);
  }

  async remove(fileUrl: string): Promise<void> {
    return this.provider.delete(fileUrl);
  }
}