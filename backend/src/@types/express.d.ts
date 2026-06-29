import { RoleName } from "../generated/prisma";
import { UploadFile } from "../storage/types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: RoleName;
      };
      uploadFile?: UploadFile;
    }
  }
}

export {};