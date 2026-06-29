import path from "node:path";

export const UPLOADS_DIRECTORY = path.resolve(process.cwd(), "uploads");

export const RECIPES_DIRECTORY = path.join(
  UPLOADS_DIRECTORY,
  "recipes",
  "generated",
);

export const RECIPES_SEED_DIRECTORY = path.join(
  UPLOADS_DIRECTORY,
  "recipes",
  "seed",
);

export const AVATARS_DIRECTORY = path.join(
  UPLOADS_DIRECTORY,
  "avatars",
  "generated",
);

export const AVATARS_SEED_DIRECTORY = path.join(
  UPLOADS_DIRECTORY,
  "avatars",
  "seed",
);

export const TEMP_DIRECTORY = path.join(
  UPLOADS_DIRECTORY,
  "tmp",
);

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;