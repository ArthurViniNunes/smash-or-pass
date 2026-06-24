import { prisma } from "../../lib/prisma";

import { UpdateProfileDto } from "./users.schemas";

export class UsersService {
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
            createdBy: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return smashs;
  }
}