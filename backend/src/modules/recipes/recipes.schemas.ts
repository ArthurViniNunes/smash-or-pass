import { z } from "zod";

export const recipeIdParamSchema =
  z.object({
    id: z.uuid(),
  });

export const createRecipeSchema =
  z.object({
    title: z.string().min(3).max(150),

    description: z
      .string()
      .min(10)
      .max(1000),

    preparationMethod: z
      .string()
      .min(10),

    preparationTimeMinutes:
      z.number().int().positive(),

    difficulty: z.enum([
      "EASY",
      "MEDIUM",
      "HARD",
    ]),

    categoryIds: z
      .array(z.uuid())
      .min(1),

    dietPreferenceIds: z
      .array(z.uuid())
      .default([]),

    ingredients: z
      .array(
        z.object({
          ingredientId:
            z.uuid(),

          quantity:
            z.number().positive(),

          unit:
            z.string().min(1),
        })
      )
      .min(1),
  });

export type CreateRecipeDto =
  z.infer<
    typeof createRecipeSchema
  >;

export const updateRecipeSchema =
  createRecipeSchema;

export type UpdateRecipeDto =
  z.infer<
    typeof updateRecipeSchema
  >;