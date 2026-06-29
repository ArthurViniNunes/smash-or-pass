export const UploadFolder = {
  RECIPES: "recipes",
  AVATARS: "avatars",
} as const;

export type UploadFolder =
  (typeof UploadFolder)[keyof typeof UploadFolder];

export interface UploadFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

export interface StoredFile {
  filename: string;
  url: string;
}