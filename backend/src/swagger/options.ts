import { Options } from "swagger-jsdoc";

const tagOrder = [
  "Auth",
  "Users",
  "Categories",
  "Allergens",
  "Diet Preferences",
  "Ingredients",
  "Recipes",
  "Comments",
  "Recipe Interactions",
  "Moderation",
  "Dashboard",
];

const pathOrder = [
  "/auth/register",
  "/auth/login",
  "/auth/me",
  "/users",
  "/users/me",
  "/users/me/allergens",
  "/users/me/diet-preferences",
  "/categories",
  "/categories/{id}",
  "/allergens",
  "/allergens/{id}",
  "/diet-preferences",
  "/diet-preferences/{id}",
  "/ingredients",
  "/ingredients/{id}",
  "/recipes",
  "/recipes/{id}",
  "/comments/recipe/{recipeId}",
  "/comments",
  "/comments/{id}",
  "/interactions/feed",
  "/interactions/swipe",
  "/interactions/undo",
  "/moderation/pending",
  "/moderation/recipes/{id}",
  "/moderation/categories/{id}",
  "/moderation/ingredients/{id}",
  "/dashboard",
];

const methodOrder = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
];

const getRank = (value: string, order: string[]) => {
  const index = order.indexOf(value);

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Smash or Pass API",
      version: "1.0.0",
      description: "API oficial do Smash or Pass",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    tags: tagOrder.map((name) => ({
      name,
    })),

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  tagsSorter: (a: string, b: string) => {
    const orderDiff =
      getRank(a, tagOrder) - getRank(b, tagOrder);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return a.localeCompare(b);
  },

  operationsSorter: (a: any, b: any) => {
    const pathA = a.get("path");
    const pathB = b.get("path");
    const methodA = a.get("method");
    const methodB = b.get("method");

    const pathDiff =
      getRank(pathA, pathOrder) - getRank(pathB, pathOrder);

    if (pathDiff !== 0) {
      return pathDiff;
    }

    const methodDiff =
      getRank(methodA, methodOrder) - getRank(methodB, methodOrder);

    if (methodDiff !== 0) {
      return methodDiff;
    }

    const alphaPathDiff = pathA.localeCompare(pathB);

    if (alphaPathDiff !== 0) {
      return alphaPathDiff;
    }

    return methodA.localeCompare(methodB);
  },

  apis: ["./src/modules/**/*.ts"],
};