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

    await prisma.userAllergen.createMany({
      data: allergenIds.map((allergenId) => ({
        userId,
        allergenId,
      })),
    });

    return prisma.user.findUnique({
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
  }
}