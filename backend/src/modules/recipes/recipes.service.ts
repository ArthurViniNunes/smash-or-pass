import { prisma } from "../../lib/prisma";

import { HttpError }
  from "../../utils/http-error";

import {
  CreateRecipeDto,
  UpdateRecipeDto,
} from "./recipes.schemas";

import {
  validateRecipeOwnership,
} from "../../utils/validate-recipe-ownership";
import { RoleName } from "../../generated/prisma";

export class RecipesService {
  async create(
    userId: string,
    data: CreateRecipeDto
  ) {
    const categories =
      await prisma.category.findMany({
        where: {
          id: {
            in: data.categoryIds,
          },

          status: "APPROVED",
        },
      });

    if (
      categories.length !==
      data.categoryIds.length
    ) {
      throw new HttpError(
        400,
        "Invalid categories"
      );
    }

    const ingredients =
      await prisma.ingredient.findMany({
        where: {
          id: {
            in: data.ingredients.map(
              (item) =>
                item.ingredientId
            ),
          },

          status: "APPROVED",
        },
      });

    if (
      ingredients.length !==
      data.ingredients.length
    ) {
      throw new HttpError(
        400,
        "Invalid ingredients"
      );
    }

    return prisma.recipe.create({
      data: {
        title: data.title,

        description:
          data.description,

        preparationMethod:
          data.preparationMethod,

        preparationTimeMinutes:
          data.preparationTimeMinutes,

        difficulty:
          data.difficulty,

        status: "PENDING",

        authorId: userId,

        categories: {
          create:
            data.categoryIds.map(
              (categoryId) => ({
                categoryId,
              })
            ),
        },

        dietPreferences: {
          create:
            data.dietPreferenceIds.map(
              (
                dietPreferenceId
              ) => ({
                dietPreferenceId,
              })
            ),
        },

        ingredients: {
          create:
            data.ingredients.map(
              (ingredient) => ({
                ingredientId:
                  ingredient.ingredientId,

                quantity:
                  ingredient.quantity,

                unit:
                  ingredient.unit,
              })
            ),
        },
      },

      include: {
        categories: true,
        ingredients: true,
        dietPreferences: true,
      },
    });
  }

  async findAll() {
    return prisma.recipe.findMany({
        where: {
        status: "APPROVED",
        },

        include: {
        author: {
            select: {
            id: true,
            username: true,
            avatarUrl: true,
            },
        },

        categories: {
            include: {
            category: true,
            },
        },

        dietPreferences: {
            include: {
            dietPreference: true,
            },
        },

        ingredients: {
            include: {
            ingredient: true,
            },
        },
        },

        orderBy: {
        createdAt: "desc",
        },
    });
  }

  async findById(id: string) {
  const recipe =
      await prisma.recipe.findFirst({
      where: {
          id,
          status: "APPROVED",
      },

      include: {
          author: {
          select: {
              id: true,
              username: true,
              avatarUrl: true,
          },
          },

          categories: {
          include: {
              category: true,
          },
          },

          dietPreferences: {
          include: {
              dietPreference: true,
          },
          },

          ingredients: {
          include: {
              ingredient: true,
          },
          },

          comments: {
          include: {
              user: {
              select: {
                  id: true,
                  username: true,
              },
              },
          },

          orderBy: {
              createdAt: "desc",
          },
          },
      },
      });

  if (!recipe) {
      throw new HttpError(
      404,
      "Recipe not found"
      );
  }

  return recipe;
  }

  async getSwipeFeed(userId: string, cursor?: string) {
    const [userAllergens, userDiets, interactions] = await Promise.all([
      prisma.userAllergen.findMany({
        where: { userId },
        select: { allergenId: true },
      }),

      prisma.userDietPreference.findMany({
        where: { userId },
        select: { dietPreferenceId: true },
      }),

      prisma.recipeInteraction.findMany({
        where: { userId },
        select: { recipeId: true },
      }),
    ]);

    const excludedIds = interactions.map(i => i.recipeId);

    const allergenIds = userAllergens.map(a => a.allergenId);

    const baseWhere = {
      status: "APPROVED" as const,
      id: {
        notIn: excludedIds,
      },
      ingredients: {
        none: {
          ingredient: {
            allergens: {
              some: {
                allergenId: {
                  in: allergenIds,
                },
              },
            },
          },
        },
      },
    };

    // 1. PRIMEIRO: receitas nunca vistas
    const freshRecipes = await prisma.recipe.findMany({
      where: baseWhere,
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    // 2. FALLBACK: se não tiver conteúdo suficiente, recicla antigas
    if (freshRecipes.length < 10) {
      const fallback = await prisma.recipe.findMany({
        where: {
          status: "APPROVED",
          id: {
            notIn: excludedIds,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 20,
      });

      return fallback;
    }

    return freshRecipes;
  }

  async update(
    recipeId: string,
    userId: string,
    role: RoleName,
    data: UpdateRecipeDto
  ) {
    await validateRecipeOwnership(
      recipeId,
      userId,
      role
    );

    const categories =
      await prisma.category.findMany({
        where: {
          id: {
            in: data.categoryIds,
          },
          status: "APPROVED",
        },
      });

    if (
      categories.length !==
      data.categoryIds.length
    ) {
      throw new HttpError(
        400,
        "Invalid categories"
      );
    }

    const ingredients =
      await prisma.ingredient.findMany({
        where: {
          id: {
            in: data.ingredients.map(
              (item) =>
                item.ingredientId
            ),
          },
          status: "APPROVED",
        },
      });

    if (
      ingredients.length !==
      data.ingredients.length
    ) {
      throw new HttpError(
        400,
        "Invalid ingredients"
      );
    }

    await prisma.$transaction([
      prisma.recipeCategory.deleteMany({
        where: {
          recipeId,
        },
      }),

      prisma.recipeDietPreference.deleteMany({
        where: {
          recipeId,
        },
      }),

      prisma.recipeIngredient.deleteMany({
        where: {
          recipeId,
        },
      }),
    ]);

    return prisma.recipe.update({
      where: {
        id: recipeId,
      },

      data: {
        title: data.title,

        description:
          data.description,

        preparationMethod:
          data.preparationMethod,

        preparationTimeMinutes:
          data.preparationTimeMinutes,

        difficulty:
          data.difficulty,

        categories: {
          create:
            data.categoryIds.map(
              (categoryId) => ({
                categoryId,
              })
            ),
        },

        dietPreferences: {
          create:
            data.dietPreferenceIds.map(
              (
                dietPreferenceId
              ) => ({
                dietPreferenceId,
              })
            ),
        },

        ingredients: {
          create:
            data.ingredients.map(
              (ingredient) => ({
                ingredientId:
                  ingredient.ingredientId,

                quantity:
                  ingredient.quantity,

                unit:
                  ingredient.unit,
              })
            ),
        },
      },

      include: {
        categories: true,
        ingredients: true,
        dietPreferences: true,
      },
    });
  }

  async delete(
    recipeId: string,
    userId: string,
    role: RoleName
  ) {
    await validateRecipeOwnership(
      recipeId,
      userId,
      role
    );

    await prisma.recipe.delete({
      where: {
        id: recipeId,
      },
    });
  }
}