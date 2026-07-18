import bcrypt from "bcrypt";

import {
  PrismaClient,
  Difficulty,
  InteractionType,
  ModerationStatus,
  RoleName,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed completo...");

  console.log("⏱️ Tempo estimado é de 6 minutos, mas pode variar dependendo do desempenho do seu computador.");

  // =====================================
  // LIMPEZA
  // =====================================
  console.log("🧹 Limpando dados existentes...");

  await prisma.recipeInteraction.deleteMany();
  await prisma.comment.deleteMany();

  await prisma.recipeIngredient.deleteMany();
  await prisma.recipeCategory.deleteMany();
  await prisma.recipeDietPreference.deleteMany();

  await prisma.recipe.deleteMany();

  await prisma.userAllergen.deleteMany();
  await prisma.userDietPreference.deleteMany();

  await prisma.ingredientAllergen.deleteMany();

  await prisma.category.deleteMany();
  await prisma.ingredient.deleteMany();

  await prisma.allergen.deleteMany();
  await prisma.dietPreference.deleteMany();

  await prisma.user.deleteMany();

  console.log("🧹 Dados limpos com sucesso!");


  // =====================================
  // SENHA PADRÃO
  // =====================================

  const passwordHash = await bcrypt.hash(
    "12345678",
    10
  );

  // =====================================
  // USERS
  // =====================================

  console.log("👤 Criando usuários...");

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      username: "admin",
      email: "admin@smash.com",
      passwordHash,
      role: RoleName.ADMIN,
      bio: "Administrador do sistema",
      avatarUrl: "/uploads/avatars/seed/admin-avatar.webp",
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Arthur",
        username: "arthur",
        email: "arthur@email.com",
        avatarUrl: "/uploads/avatars/seed/default-avatar.webp",
        passwordHash,
      },
    }),

    prisma.user.create({
      data: {
        name: "Maria",
        username: "maria",
        email: "maria@email.com",
        passwordHash,
        avatarUrl: "/uploads/avatars/seed/default-avatar.webp",
      },
    }),

    prisma.user.create({
      data: {
        name: "João",
        username: "joao",
        email: "joao@email.com",
        passwordHash,
        avatarUrl: "/uploads/avatars/seed/default-avatar.webp",
      },
    }),

    prisma.user.create({
      data: {
        name: "Ana",
        username: "ana",
        email: "ana@email.com",
        passwordHash,
        avatarUrl: "/uploads/avatars/seed/default-avatar.webp",
      },
    }),

    prisma.user.create({
      data: {
        name: "Pedro",
        username: "pedro",
        email: "pedro@email.com",
        passwordHash,
        avatarUrl: "/uploads/avatars/seed/default-avatar.webp",
      },
    }),
  ]);

  const allUsers = [admin, ...users];
  console.log("👤 Usuários criados com sucesso!");

  // =====================================
  // ALERGÊNICOS
  // =====================================

  console.log("🧪 Criando alergênicos...");
  const allergens = await Promise.all(
    [
      "Glúten",
      "Leite",
      "Ovo",
      "Soja",
      "Amendoim",
      "Castanhas",
    ].map((name) =>
      prisma.allergen.create({
        data: { name },
      })
    )
  );

  console.log("🧪 Alergênicos criados com sucesso!");

  // =====================================
  // DIET PREFERENCES
  // =====================================

  console.log("🥗 Criando dietas...");
  const dietPreferences =
    await Promise.all(
      [
        "Vegano",
        "Vegetariano",
        "Sem Lactose",
        "Sem Glúten",
        "Low Carb",
      ].map((name) =>
        prisma.dietPreference.create({
          data: { name },
        })
      )
    );

  console.log("🥗 Dietas criadas com sucesso!");

  // =====================================
  // CATEGORIAS
  // =====================================

  console.log("📂 Criando categorias...");

  const categories =
    await Promise.all(
      [
        "Fitness",
        "Sobremesa",
        "Vegana",
        "Massas",
        "Carnes",
        "Bebidas",
        "Café da Manhã",
        "Lanches",
      ].map((name) =>
        prisma.category.create({
          data: {
            name,
            status:
              ModerationStatus.APPROVED,
            createdById: admin.id,
          },
        })
      )
    );
    console.log("📂 Categorias criadas com sucesso!");

  // =====================================
  // INGREDIENTES
  // =====================================

  console.log("🥕 Criando ingredientes...");
  const ingredientNames = [
    "Farinha",
    "Leite",
    "Ovo",
    "Açúcar",
    "Sal",
    "Tomate",
    "Cebola",
    "Alho",
    "Frango",
    "Carne Moída",
    "Queijo",
    "Manteiga",
    "Chocolate",
    "Banana",
    "Maçã",
    "Aveia",
    "Arroz",
    "Feijão",
    "Macarrão",
    "Batata",
    "Cenoura",
    "Brócolis",
    "Tofu",
    "Amendoim",
    "Castanha",
  ];

  const ingredients =
    await Promise.all(
      ingredientNames.map((name) =>
        prisma.ingredient.create({
          data: {
            name,
            status:
              ModerationStatus.APPROVED,
            createdById: admin.id,
          },
        })
      )
    );

  console.log("🥕 Ingredientes criados com sucesso!");
  // =====================================
  // INGREDIENTE -> ALERGÊNICO
  // =====================================

  console.log("🔬 Relacionando ingredientes com alergênicos...");

  const allergenByName = Object.fromEntries(
    allergens.map((a) => [a.name, a])
  );

  const ingredientByName = Object.fromEntries(
    ingredients.map((i) => [i.name, i])
  );

  await prisma.ingredientAllergen.createMany({
    data: [
      {
        ingredientId:
          ingredientByName["Farinha"].id,
        allergenId:
          allergenByName["Glúten"].id,
      },

      {
        ingredientId:
          ingredientByName["Leite"].id,
        allergenId:
          allergenByName["Leite"].id,
      },

      {
        ingredientId:
          ingredientByName["Ovo"].id,
        allergenId:
          allergenByName["Ovo"].id,
      },

      {
        ingredientId:
          ingredientByName["Amendoim"].id,
        allergenId:
          allergenByName["Amendoim"].id,
      },

      {
        ingredientId:
          ingredientByName["Castanha"].id,
        allergenId:
          allergenByName["Castanhas"].id,
      },
    ],
  });

  console.log("🔬 Ingredientes relacionados com alergênicos com sucesso!");

  // =====================================
  // USER ALLERGENS
  // =====================================

  console.log("👤 Relacionando usuários com alergênicos...");
  await prisma.userAllergen.createMany({
    data: [
      {
        userId: users[0].id,
        allergenId:
          allergenByName["Glúten"].id,
      },

      {
        userId: users[1].id,
        allergenId:
          allergenByName["Leite"].id,
      },

      {
        userId: users[2].id,
        allergenId:
          allergenByName["Amendoim"].id,
      },
    ],
  });

  console.log("👤 Usuários relacionados com alergênicos com sucesso!");
  // =====================================
  // USER DIET PREFERENCES
  // =====================================

  console.log("👤 Relacionando usuários com dietas...");

  await prisma.userDietPreference.createMany({
    data: [
      {
        userId: users[0].id,
        dietPreferenceId:
          dietPreferences[4].id,
      },

      {
        userId: users[1].id,
        dietPreferenceId:
          dietPreferences[1].id,
      },

      {
        userId: users[2].id,
        dietPreferenceId:
          dietPreferences[2].id,
      },

      {
        userId: users[3].id,
        dietPreferenceId:
          dietPreferences[0].id,
      },
    ],
  });

  console.log("👤 Usuários relacionados com dietas com sucesso!");

  // =====================================
  // RECEITAS
  // =====================================

  console.log("🍽️ Criando receitas...");

  const recipeSeeds = [
    {
      title: "Bolo de Chocolate",
      imageUrl: "/uploads/recipes/seed/bolo-chocolate.webp",
    },
    {
      title: "Macarrão ao Molho Branco",
      imageUrl: "/uploads/recipes/seed/macarrao.webp",
    },
    {
      title: "Salada Caesar",
      imageUrl: "/uploads/recipes/seed/salada-caesar.webp",
    },
    {
      title: "Frango Fitness",
    },
    {
      title: "Hambúrguer Artesanal",
    },
    {
      title: "Panqueca de Banana",
    },
    {
      title: "Arroz com Brócolis",
    },
    {
      title: "Tofu Grelhado",
    },
    {
      title: "Brownie Caseiro",
    },
    {
      title: "Café Proteico",
    },
    {
      title: "Batata Assada",
    },
    {
      title: "Carne Acebolada",
    },
    {
      title: "Lasanha",
    },
    {
      title: "Cookie de Aveia",
    },
    {
      title: "Vitamina de Banana",
    },
    {
      title: "Risoto Simples",
    },
    {
      title: "Wrap Fitness",
    },
    {
      title: "Torta de Maçã",
    },
    {
      title: "Macarrão Vegano",
    },
    {
      title: "Brigadeiro Fit",
    },
  ];

  const recipes = [];

  for (let i = 0; i < recipeSeeds.length; i++) {
    const author =
      allUsers[i % allUsers.length];

    const recipe =
      await prisma.recipe.create({
        data: {
          title: recipeSeeds[i].title,
          imageUrl: recipeSeeds[i].imageUrl ?? null,

          description:
            `Descrição da receita ${i + 1}`,

          preparationMethod:
            "Misture os ingredientes e cozinhe até atingir o ponto ideal.",

          preparationTimeMinutes:
            15 + i,

          difficulty:
            i % 3 === 0
              ? Difficulty.EASY
              : i % 3 === 1
              ? Difficulty.MEDIUM
              : Difficulty.HARD,

          status:
            ModerationStatus.APPROVED,

          authorId: author.id,
        },
      });

    recipes.push(recipe);
  }

  console.log("🍽️ Receitas criadas com sucesso!");

  // =====================================
  // RECEITA -> CATEGORIAS
  // =====================================

  console.log("🔗 Relacionando receitas com categorias...");

  for (let i = 0; i < recipes.length; i++) {
    await prisma.recipeCategory.createMany({
      data: [
        {
          recipeId: recipes[i].id,
          categoryId:
            categories[
              i % categories.length
            ].id,
        },

        {
          recipeId: recipes[i].id,
          categoryId:
            categories[
              (i + 1) %
                categories.length
            ].id,
        },
      ],
    });
  }

  console.log("🔗 Receitas relacionadas com categorias com sucesso!");

  // =====================================
  // RECEITA -> DIETAS
  // =====================================

  console.log("🔗 Relacionando receitas com dietas...");

  for (let i = 0; i < recipes.length; i++) {
    if (i % 2 === 0) {
      await prisma.recipeDietPreference.create(
        {
          data: {
            recipeId: recipes[i].id,

            dietPreferenceId:
              dietPreferences[
                i %
                  dietPreferences.length
              ].id,
          },
        }
      );
    }
  }

  console.log("🔗 Receitas relacionadas com dietas com sucesso!");

  // =====================================
  // RECEITA -> INGREDIENTES
  // =====================================

  console.log("🔗 Relacionando receitas com ingredientes...");

  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < 5; j++) {
      const ingredient =
        ingredients[
          (i + j) %
            ingredients.length
        ];

      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipes[i].id,

          ingredientId:
            ingredient.id,

          quantity: 100 + j * 50,

          unit: "g",
        },
      });
    }
  }

  console.log("🔗 Ingredientes relacionados com alergênicos com sucesso!");
  // =====================================
  // COMENTÁRIOS
  // =====================================

  console.log("💬 Criando comentários...");

  const commentsTexts = [
    "Receita excelente.",
    "Ficou muito saborosa.",
    "Vou fazer novamente.",
    "Minha família adorou.",
    "Muito fácil de preparar.",
    "Resultado incrível.",
    "Melhor receita que encontrei.",
    "Ficou perfeita.",
    "Ótima combinação de ingredientes.",
    "Super recomendo.",
  ];

  for (let i = 0; i < 60; i++) {
    const recipe =
      recipes[i % recipes.length];

    const user =
      allUsers[i % allUsers.length];

    await prisma.comment.create({
      data: {
        content:
          commentsTexts[
            i % commentsTexts.length
          ],

        recipeId: recipe.id,

        userId: user.id,
      },
    });
  }

  console.log("💬 Comentários criados com sucesso!");

  // =====================================
  // INTERAÇÕES
  // =====================================
  //
  // Regra do schema:
  // @@unique([userId, recipeId])
  //
  // Portanto não podemos gerar
  // combinações repetidas.
  //

  console.log("🔥 Criando interações...");

  const usedPairs = new Set<string>();

  while (usedPairs.size < 100) {
    const user =
      allUsers[
        Math.floor(
          Math.random() *
            allUsers.length
        )
      ];

    const recipe =
      recipes[
        Math.floor(
          Math.random() *
            recipes.length
        )
      ];

    const key =
      `${user.id}-${recipe.id}`;

    if (usedPairs.has(key)) {
      continue;
    }

    usedPairs.add(key);

    await prisma.recipeInteraction.create({
      data: {
        userId: user.id,

        recipeId: recipe.id,

        type:
          Math.random() > 0.5
            ? InteractionType.SMASH
            : InteractionType.PASS,
      },
    });
  }
  
  console.log("🔥 Interações criadas com sucesso!");

  // =====================================
  // RESUMO
  // =====================================

  console.log(
    "✅ Seed concluído com sucesso"
  );

  console.log(
    `👤 Usuários: ${allUsers.length}`
  );

  console.log(
    `📂 Categorias: ${categories.length}`
  );

  console.log(
    `🥕 Ingredientes: ${ingredients.length}`
  );

  console.log(
    `🍽️ Receitas: ${recipes.length}`
  );

  console.log(
    "💬 Comentários: 60"
  );

  console.log(
    "🔥 Interações: 100"
  );

  console.log(
    "✅ Seed concluído com sucesso!"
  );

}

main()
  .catch((error) => {
    console.error(
      "❌ Erro no seed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });