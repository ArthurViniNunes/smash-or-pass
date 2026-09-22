import { RoleName } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";
import { validateCommentOwnership } from "../../utils/validate-comment-ownership";
import { CreateCommentDto, UpdateCommentDto } from "./comments.schemas";
import { recipeCache } from "../../cache/recipe-cache";

export class CommentsService {

  private async findCommentById(
    id: string
  ) {
    const comment =
      await prisma.comment.findUnique({
        where: { id },
      });

    if (!comment) {
      throw new HttpError(
        404,
        "Comment not found"
      );
    }

    return comment;
  }

  async create(userId: string, data: CreateCommentDto) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: data.recipeId },
      select: { id: true },
    });

    if (!recipe) {
      throw new HttpError(404, "Recipe not found");
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        recipeId: data.recipeId,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    await recipeCache.invalidate(data.recipeId);

    return comment;
  }

  async findByRecipe(recipeId: string) {
    return prisma.comment.findMany({
      where: { recipeId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(
    id: string,
    currentUserId: string,
    currentUserRole: RoleName,
    data: UpdateCommentDto
  ) {
    const comment =
      await this.findCommentById(id);

    validateCommentOwnership({
      commentUserId: comment.userId,
      currentUserId,
      currentUserRole,
    });

    const updatedComment = await prisma.comment.update({
      where: { id },

      data: {
        content: data.content,
      },
    });

    await recipeCache.invalidate(
      comment.recipeId
    );

    return updatedComment;
  }

  async delete(
    id: string,
    currentUserId: string,
    currentUserRole: RoleName
  ) {
    const comment =
      await this.findCommentById(id);

    validateCommentOwnership({
      commentUserId: comment.userId,
      currentUserId,
      currentUserRole,
    });

    await prisma.comment.delete({
      where: { id },
    });

    await recipeCache.invalidate(
      comment.recipeId
    );

    return;
  }
}