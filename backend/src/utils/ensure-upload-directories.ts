import {
  RECIPES_DIRECTORY,
  RECIPES_SEED_DIRECTORY,
  AVATARS_DIRECTORY,
  AVATARS_SEED_DIRECTORY,
  TEMP_DIRECTORY,
} from "../config/upload";

import { ensureDirectory } from "./ensure-directory";

export function ensureUploadDirectories() {
  ensureDirectory(RECIPES_DIRECTORY);
  ensureDirectory(RECIPES_SEED_DIRECTORY);

  ensureDirectory(AVATARS_DIRECTORY);
  ensureDirectory(AVATARS_SEED_DIRECTORY);

  ensureDirectory(TEMP_DIRECTORY);
}