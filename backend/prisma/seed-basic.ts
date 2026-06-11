import bcrypt from "bcrypt";

import {
  PrismaClient,
  Difficulty,
  ModerationStatus,
  InteractionType,
  RoleName,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed básico...");

  const passwordHash =
    await bcrypt.hash("12345678", 10);

  // =========================
  // USERS
  // =========================

  const admin =
    await prisma.user.upsert({
      where: {
        email: "admin@smash.com",
      },

      update: {},

      create: {
        name: "Administrador",
        username: "admin",
        email: "admin@smash.com",
        passwordHash,
        role: RoleName.ADMIN,
      },
    });

  const joao =
    await prisma.user.upsert({
      where: {
        email: "joao@email.com",
      },

      update: {},

      create: {
        name: "João Silva",
        username: "joao",
        email: "joao@email.com",
        passwordHash,
      },
    });

  const maria =
    await prisma.user.upsert({
      where: {
        email: "maria@email.com",
      },

      update: {},

      create: {
        name: "Maria Souza",
        username: "maria",
        email: "maria@email.com",
        passwordHash,
      },
    });

  const pedro =
    await prisma.user.upsert({
      where: {
        email: "pedro@email.com",
      },

      update: {},

      create: {
        name: "Pedro Lima",
        username: "pedro",
        email: "pedro@email.com",
        passwordHash,
      },
    });

  // =========================
  // ALLERGENS
  // =========================

  const leite =
    await prisma.allergen.upsert({
      where: { name: "Leite" },
      update: {},
      create: { name: "Leite" },
    });

  const gluten =
    await prisma.allergen.upsert({
      where: { name: "Glúten" },
      update: {},
      create: { name: "Glúten" },
    });

  // =========================
  // DIETS
  // =========================

  const vegano =
    await prisma.dietPreference.upsert({
      where: { name: "Vegano" },
      update: {},
      create: { name: "Vegano" },
    });

  const lowCarb =
    await prisma.dietPreference.upsert({
      where: { name: "Low Carb" },
      update: {},
      create: { name: "Low Carb" },
    });

  // =========================
  // USER ALLERGENS
  // =========================

  await prisma.userAllergen.upsert({
    where: {
      userId_allergenId: {
        userId: joao.id,
        allergenId: leite.id,
      },
    },

    update: {},

    create: {
      userId: joao.id,
      allergenId: leite.id,
    },
  });

  // =========================
  // USER DIETS
  // =========================

  await prisma.userDietPreference.upsert({
    where: {
      userId_dietPreferenceId: {
        userId: maria.id,
        dietPreferenceId: vegano.id,
      },
    },

    update: {},

    create: {
      userId: maria.id,
      dietPreferenceId: vegano.id,
    },
  });

  // =========================
  // CATEGORIES
  // =========================

  const sobremesa =
    await prisma.category.upsert({
      where: { name: "Sobremesa" },

      update: {},

      create: {
        name: "Sobremesa",
        status:
          ModerationStatus.APPROVED,
        createdById: admin.id,
      },
    });

  const fitness =
    await prisma.category.upsert({
      where: { name: "Fitness" },

      update: {},

      create: {
        name: "Fitness",
        status:
          ModerationStatus.APPROVED,
        createdById: admin.id,
      },
    });

  // =========================
  // INGREDIENTS
  // =========================

  const banana =
    await prisma.ingredient.upsert({
      where: {
        name: "Banana",
      },

      update: {},

      create: {
        name: "Banana",
        status:
          ModerationStatus.APPROVED,
        createdById: admin.id,
      },
    });

  const aveia =
    await prisma.ingredient.upsert({
      where: {
        name: "Aveia",
      },

      update: {},

      create: {
        name: "Aveia",
        status:
          ModerationStatus.APPROVED,
        createdById: admin.id,
      },
    });

  const chocolate =
    await prisma.ingredient.upsert({
      where: {
        name: "Chocolate",
      },

      update: {},

      create: {
        name: "Chocolate",
        status:
          ModerationStatus.APPROVED,
        createdById: admin.id,
      },
    });

  // =========================
  // RECIPES
  // =========================

  const bolo =
    await prisma.recipe.create({
      data: {
        title:
          "Bolo de Chocolate",

        description:
          "Bolo simples de chocolate",

        preparationMethod:
          "Misture todos os ingredientes e asse por 40 minutos.",

        preparationTimeMinutes:
          60,

        difficulty:
          Difficulty.MEDIUM,

        status:
          ModerationStatus.APPROVED,

        authorId: joao.id,

        categories: {
          create: [
            {
              categoryId:
                sobremesa.id,
            },
          ],
        },

        ingredients: {
          create: [
            {
              ingredientId:
                chocolate.id,

              quantity: 300,

              unit: "g",
            },
          ],
        },
      },
    });

  const vitamina =
    await prisma.recipe.create({
      data: {
        title:
          "Vitamina de Banana",

        description:
          "Vitamina saudável",

        preparationMethod:
          "Bata todos os ingredientes no liquidificador.",

        preparationTimeMinutes:
          5,

        difficulty:
          Difficulty.EASY,

        status:
          ModerationStatus.APPROVED,

        authorId: maria.id,

        categories: {
          create: [
            {
              categoryId:
                fitness.id,
            },
          ],
        },

        dietPreferences: {
          create: [
            {
              dietPreferenceId:
                lowCarb.id,
            },
          ],
        },

        ingredients: {
          create: [
            {
              ingredientId:
                banana.id,

              quantity: 2,

              unit: "un",
            },

            {
              ingredientId:
                aveia.id,

              quantity: 50,

              unit: "g",
            },
          ],
        },
      },
    });

  // =========================
  // COMMENTS
  // =========================

  await prisma.comment.createMany({
    data: [
      {
        content:
          "Receita excelente!",
        recipeId: bolo.id,
        userId: maria.id,
      },

      {
        content:
          "Gostei bastante.",
        recipeId: bolo.id,
        userId: pedro.id,
      },

      {
        content:
          "Faço toda semana.",
        recipeId: vitamina.id,
        userId: joao.id,
      },
    ],
  });

  // =========================
  // INTERACTIONS
  // =========================

  await prisma.recipeInteraction.createMany({
    data: [
      {
        userId: maria.id,
        recipeId: bolo.id,
        type:
          InteractionType.SMASH,
      },

      {
        userId: pedro.id,
        recipeId: bolo.id,
        type:
          InteractionType.SMASH,
      },

      {
        userId: joao.id,
        recipeId: vitamina.id,
        type:
          InteractionType.PASS,
      },
    ],

    skipDuplicates: true,
  });

  console.log("✅ Seed completo concluído");

  console.log("\nUsuários:");

  console.log(
    "admin@smashorpass.com / 123456"
  );

  console.log(
    "joao@email.com / 123456"
  );

  console.log(
    "maria@email.com / 123456"
  );

  console.log(
    "pedro@email.com / 123456"
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });