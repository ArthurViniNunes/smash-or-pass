import { apiRequest } from "./api";
import type {
  AdminRecipe,
  ModerationStatus,
  PendingModerationResult,
} from "@/types/admin";

export const moderationService = {
  // Itens pendentes (admin): { recipes, categories, ingredients }
  getPending(): Promise<PendingModerationResult> {
    return apiRequest<PendingModerationResult>("/moderation/pending", {
      auth: true,
    });
  },

  // Receitas aprovadas (rota pública) — usadas na aba "Aprovadas".
  getApprovedRecipes(): Promise<AdminRecipe[]> {
    return apiRequest<AdminRecipe[]>("/recipes");
  },

  // Receitas rejeitadas (admin) — usadas na aba "Rejeitadas".
  getRejectedRecipes(): Promise<AdminRecipe[]> {
    return apiRequest<AdminRecipe[]>("/moderation/rejected", {
      auth: true,
    });
  },

  // Altera o status de moderação de uma receita.
  setRecipeStatus(id: string, status: ModerationStatus): Promise<AdminRecipe> {
    return apiRequest<AdminRecipe>(`/moderation/recipes/${id}`, {
      method: "PATCH",
      body: { status },
      auth: true,
    });
  },

  // Exclui uma receita (admin pode excluir qualquer uma).
  deleteRecipe(id: string): Promise<void> {
    return apiRequest<void>(`/recipes/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};