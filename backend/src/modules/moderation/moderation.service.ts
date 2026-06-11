import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";
import { ModerationStatus } from "../../generated/prisma";

export class ModerationService {
  async listPending() {
    const [recipes, categories, ingredients] = await Promise.all([
      prisma.recipe.findMany({ where: { status: "PENDING" } }),
      prisma.category.findMany({ where: { status: "PENDING" } }),
      prisma.ingredient.findMany({ where: { status: "PENDING" } }),
    ]);

    return { recipes, categories, ingredients };
  }

  async moderateRecipe(id: string, status: ModerationStatus) {
    const recipe = await prisma.recipe.findUnique({ where: { id } });

    if (!recipe) throw new HttpError(404, "Recipe not found");

    return prisma.recipe.update({
      where: { id },
      data: { status },
    });
  }

  async moderateCategory(id: string, status: ModerationStatus) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) throw new HttpError(404, "Category not found");

    return prisma.category.update({
      where: { id },
      data: { status },
    });
  }

  async moderateIngredient(id: string, status: ModerationStatus) {
    const ingredient = await prisma.ingredient.findUnique({ where: { id } });

    if (!ingredient) throw new HttpError(404, "Ingredient not found");

    return prisma.ingredient.update({
      where: { id },
      data: { status },
    });
  }
}