import { apiRequest } from "./api";
import {
	ApiRecipe,
	Difficulty,
	InteractionType,
	RecipeView,
} from "@/types/recipe";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
	EASY: "Fácil",
	MEDIUM: "Médio",
	HARD: "Difícil",
};

function buildIngredientLabel(item: ApiRecipe["ingredients"] extends (infer T)[]
	? T
	: never): string {
	const amount = [item.quantity, item.unit].filter(Boolean).join(" ").trim();
	return amount ? `${amount} de ${item.ingredient.name}` : item.ingredient.name;
}

// Converte a receita da API no formato que a UI espera
export function mapRecipe(api: ApiRecipe): RecipeView {
	return {
		id: api.id,
		title: api.title,
		subtitle: api.description,
		imageUrl: api.imageUrl ?? undefined,
		preparation: api.preparationMethod,
		difficultyLabel: DIFFICULTY_LABELS[api.difficulty] ?? api.difficulty,
		timeLabel: `${api.preparationTimeMinutes} min`,
		tags: (api.categories ?? []).map((c) => c.category.name),
		ingredients: (api.ingredients ?? []).map(buildIngredientLabel),
		authorName: api.author?.username ?? "",
	};
}

export const recipeService = {
	async getFeed(limit = 10): Promise<RecipeView[]> {
		const recipes = await apiRequest<ApiRecipe[]>(
			`/interactions/feed?limit=${limit}`,
			{ auth: true }
		);
		return recipes.map(mapRecipe);
	},

	async getById(id: string): Promise<ApiRecipe> {
		return apiRequest<ApiRecipe>(`/recipes/${id}`);
	},

	async swipe(recipeId: string, type: InteractionType): Promise<void> {
		await apiRequest(`/interactions/swipe`, {
			method: "POST",
			auth: true,
			body: { recipeId, type },
		});
	},

	async undo(): Promise<void> {
		await apiRequest(`/interactions/undo`, { method: "POST", auth: true });
	},
};