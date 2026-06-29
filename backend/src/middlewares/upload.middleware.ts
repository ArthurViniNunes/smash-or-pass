import { multerConfig } from "../upload";

export const uploadRecipeImage =
  multerConfig.single("image");

export const uploadAvatar =
  multerConfig.single("avatar");