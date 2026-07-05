export interface DashboardMetrics {
  users: number;
  recipes: number;
  approvedRecipes: number;
  pendingRecipes: number;
  rejectedRecipes: number;
  categories: number;
  pendingCategories: number;
  ingredients: number;
  pendingIngredients: number;
  comments: number;
  smashes: number;
  passes: number;
}

export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface AdminRecipeAuthor {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

export interface AdminRecipe {
  id: string;
  title: string;
  description: string;
  preparationMethod: string;
  preparationTimeMinutes: number;
  difficulty: Difficulty;
  imageUrl?: string | null;
  status: ModerationStatus;
  authorId: string;
  createdAt: string;
  // Presente em GET /recipes (aprovadas); ausente em GET /moderation/pending.
  author?: AdminRecipeAuthor;
}

export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogItem {
  id: string;
  name: string;
  status: ModerationStatus;
}

export interface PendingModerationResult {
  recipes: AdminRecipe[];
  categories: AdminCatalogItem[];
  ingredients: AdminCatalogItem[];
}