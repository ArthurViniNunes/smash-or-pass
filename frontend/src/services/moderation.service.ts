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
  
  // Itens rejeitados (admin): { recipes, categories, ingredients }
  getRejected(): Promise<PendingModerationResult> {
    return apiRequest<PendingModerationResult>("/moderation/rejected", {
      auth: true,
    });
  },

  // Receitas aprovadas (rota pública) — usadas na aba "Aprovadas".
  getApprovedRecipes(): Promise<AdminRecipe[]> {
    return apiRequest<AdminRecipe[]>("/recipes");
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