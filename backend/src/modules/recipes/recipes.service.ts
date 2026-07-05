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
import { LocalStorageProvider } from "../../storage/local-storage-provider";
import { StorageService } from "../../storage/storage.service";
import { UploadFolder } from "../../storage/types";

export class RecipesService {

  private storage = new StorageService(
    new LocalStorageProvider()
  );

  private async validateCategories(
    categoryIds: string[]
  ) {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
        status: "APPROVED",
      },
    });

    if (categories.length !== categoryIds.length) {
      throw new HttpError(
        400,
        "Invalid categories"
      );
    }
  }

  private async validateIngredients(
    ingredients: CreateRecipeDto["ingredients"]
  ) {
    const existingIngredients =
      await prisma.ingredient.findMany({
        where: {
          id: {
            in: ingredients.map(
              (item) => item.ingredientId
            ),
          },
          status: "APPROVED",
        },
      });

    if (
      existingIngredients.length !==
      ingredients.length
    ) {
      throw new HttpError(
        400,
        "Invalid ingredients"
      );
    }
  }

  private buildRecipeRelations(
    data: CreateRecipeDto | UpdateRecipeDto
  ) {
    return {
      categories: {
        create: data.categoryIds.map(
          (categoryId) => ({
            categoryId,
          })
        ),
      },

      dietPreferences: {
        create: data.dietPreferenceIds.map(
          (dietPreferenceId) => ({
            dietPreferenceId,
          })
        ),
      },

      ingredients: {
        create: data.ingredients.map(
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
    };
  }

  private async uploadRecipeImage(
    file?: Express.Multer.File
  ) {
    if (!file) {
      return null;
    }

    return this.storage.upload(
      {
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      },
      UploadFolder.RECIPES
    );
  }

  async create(
    userId: string,
    data: CreateRecipeDto,
    file?: Express.Multer.File
  ) {
    await this.validateCategories(
      data.categoryIds
    );

    await this.validateIngredients(
      data.ingredients
    );

    const uploadedImage =
      await this.uploadRecipeImage(file);

    try{
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

          imageUrl: uploadedImage?.url ?? null,

          ...this.buildRecipeRelations(data),
        },
        include: {
          categories: true,
          ingredients: true,
          dietPreferences: true,
        },
      });
    }
    catch (error) {
      if (uploadedImage) {
        try {
          await this.storage.remove(
            uploadedImage.url
          );
        } catch {
          // Ignora erro na limpeza
        }
      }

      throw error;
    }
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
    data: UpdateRecipeDto,
    file?: Express.Multer.File
  ) {
    await validateRecipeOwnership(
      recipeId,
      userId,
      role
    );

    const existingRecipe =
      await prisma.recipe.findUnique({
        where: {
          id: recipeId,
        },
        select: {
          imageUrl: true,
        },
      });

    if (!existingRecipe) {
      throw new HttpError(
        404,
        "Recipe not found."
      );
    }

    await this.validateCategories(
      data.categoryIds
    );

    await this.validateIngredients(
      data.ingredients
    );

    const uploadedImage =
      await this.uploadRecipeImage(file);

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

    if (
      uploadedImage &&
      existingRecipe.imageUrl
    ) {
      try {
        await this.storage.remove(
          existingRecipe.imageUrl
        );
      } catch {
        // Ignora erro de limpeza
      }
    }

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

        // Toda edição reenvia a receita para moderação: o conteúdo mudou,
        // então precisa ser reavaliado antes de voltar a ficar público.
        status: "PENDING",

        ...(uploadedImage && {
            imageUrl: uploadedImage.url,
          }),

        ...this.buildRecipeRelations(data)
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

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      select: {
        imageUrl: true,
      },
    });

    if (!recipe) {
      throw new HttpError(
        404,
        "Recipe not found."
      );
    }
    
    try {
      await prisma.recipe.delete({
        where: {
          id: recipeId,
        },
      });

      if (recipe.imageUrl) {
        try {
          await this.storage.remove(
            recipe.imageUrl
          );
        } catch {
          // Ignora erro ao remover arquivo
        }
      }
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(
        500,
        "Failed to delete recipe."
      );
    }
  }
}