import { prisma } from "../../lib/prisma";

import { HttpError } from "../../utils/http-error";
import { LocalStorageProvider } from "../../storage/local-storage-provider";
import { StorageService } from "../../storage/storage.service";
import { UploadFolder } from "../../storage/types";

import { UpdateProfileDto } from "./users.schemas";

export class UsersService {
  private storage = new StorageService(
    new LocalStorageProvider()
  );

  async listUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDto
  ) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return user;
  }

  async updateAllergens(
    userId: string,
    allergenIds: string[]
  ) {
    await prisma.userAllergen.deleteMany({
      where: {
        userId,
      },
    });

    if (allergenIds.length > 0) {
      await prisma.userAllergen.createMany({
        data: allergenIds.map(
          (allergenId) => ({
            userId,
            allergenId,
          })
        ),
      });
    }

    return this.getAllergens(userId);
  }
  
  async getAllergens(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        allergens: {
          include: {
            allergen: true,
          },
        },
      },
    });
    return user?.allergens ?? [];
  }

  async getDietPreferences(
    userId: string
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        dietPreferences: {
          include: {
            dietPreference: true,
          },
        },
      },
    });

    return user?.dietPreferences ?? [];
  }

  async updateDietPreferences(
    userId: string,
    dietPreferenceIds: string[]
  ) {
    await prisma.userDietPreference.deleteMany({
      where: {
        userId,
      },
    });

    if (
      dietPreferenceIds.length > 0
    ) {
      await prisma.userDietPreference.createMany({
        data: dietPreferenceIds.map(
          (dietPreferenceId) => ({
            userId,
            dietPreferenceId,
          })
        ),
      });
    }

    return this.getDietPreferences(
      userId
    );
  }

  async getSmashs(userId: string) {
    const smashs = await prisma.recipeInteraction.findMany({
      where: {
        userId,
        type: "SMASH",
      },
      include: {
        recipe: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            categories: {
              include: { category: true },
            },
            ingredients: {
              include: { ingredient: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // devolve as receitas no mesmo formato do /interactions/feed
    return smashs.map((interaction) => interaction.recipe);
  }

  async getMyRecipes(userId: string) {
    // Receitas do próprio autor em TODOS os status (PENDING/APPROVED/REJECTED),
    // para que o criador acompanhe a moderação. O escopo por autor é feito
    // aqui no servidor — nunca no cliente.
    return prisma.recipe.findMany({
      where: {
        authorId: userId,
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
          include: { category: true },
        },
        ingredients: {
          include: { ingredient: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getMyRecipeById(userId: string, recipeId: string) {
    // Detalhe de uma receita do próprio autor em QUALQUER status — usado para
    // pré-preencher o formulário de edição. A rota pública /recipes/:id só
    // devolve APPROVED, então pendentes/reprovadas precisam deste acesso
    // escopado pelo dono.
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        authorId: userId,
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
          include: { category: true },
        },
        dietPreferences: {
          include: { dietPreference: true },
        },
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    if (!recipe) {
      throw new HttpError(404, "Recipe not found");
    }

    return recipe;
  }

  async updateAvatar(
    userId: string,
    file?: Express.Multer.File
  ) {
    if (!file) {
      throw new Error("Avatar image is required.");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
        },
        select: {
          id: true,
          avatarUrl: true,
        },
    });

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const uploaded = await this.storage.upload(
      {
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      },
      UploadFolder.AVATARS,
    );

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: uploaded.url,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (existingUser.avatarUrl) {
      try {
        await this.storage.remove(existingUser.avatarUrl);
      } catch {
        // Não interrompe a requisição.
        // O banco já foi atualizado.
      }
    }

    return user;
  }
}