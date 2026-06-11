import { RoleName } from "../generated/prisma";

import { prisma } from "../lib/prisma";

import { HttpError } from "./http-error";

export async function validateRecipeOwnership(
  recipeId: string,
  userId: string,
  role: RoleName
) {
  const recipe =
    await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

  if (!recipe) {
    throw new HttpError(404, "Recipe not found");
  }

  const isOwner =
    recipe.authorId === userId;

  const isAdmin =
    role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new HttpError(403, "Access denied");
  }

  return recipe;
}