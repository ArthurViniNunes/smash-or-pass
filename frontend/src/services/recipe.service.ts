import { apiRequest, API_URL } from "./api";
import type {
	RecipeView,
	InteractionType,
	RecipePayload,
	ApiRecipe as ApiRecipeFull,
} from "@/types/recipe";

/**
 * Formato cru que a API retorna para uma receita.
 * (mantido local ao service; os componentes só consomem o RecipeView mapeado)
 */
type ApiRecipe = {
	id: string;
	title: string;
	description?: string;
	preparationMethod?: string;
	preparationTimeMinutes?: number;
	difficulty?: string;
	imageUrl?: string | null;
	status?: string;
	authorId?: string;
	author?: {
		id: string;
		username: string;
		avatarUrl?: string | null;
	};
	categories?: Array<{
		category?: { id: string; name: string; status?: string };
	}>;
	ingredients?: Array<{
		quantity?: number;
		unit?: string;
		ingredient?: {
			id: string;
			name: string;
			allergens?: Array<{ allergen?: { id: string; name: string } }>;
		};
	}>;
};

const DIFFICULTY_LABELS: Record<string, string> = {
	EASY: "Fácil",
	MEDIUM: "Médio",
	HARD: "Difícil",
};

/**
 * O backend grava a imagem como caminho relativo (ex.: /uploads/recipes/generated/x.webp),
 * servido pela API. Prefixamos com a API_URL para a tag <img> conseguir carregar.
 * URLs absolutas (http/https) são mantidas como estão.
 */
export function resolveImageUrl(
	url?: string | null
): string | undefined {
	if (!url) return undefined;
	if (/^https?:\/\//i.test(url)) return url;
	return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function buildIngredientLabel(item: ApiRecipe["ingredients"][number]): string {
	const quantity = item.quantity ?? "";
	const unit = item.unit ?? "";
	const name = item.ingredient?.name ?? "";
	return `${quantity} ${unit} de ${name}`.replace(/\s+/g, " ").trim();
}

/** Junta (sem repetir) os alérgenos de todos os ingredientes da receita. */
function collectAllergens(ingredients: ApiRecipe["ingredients"]): string[] {
	const set = new Set<string>();
	(ingredients ?? []).forEach((item) => {
		(item.ingredient?.allergens ?? []).forEach((link) => {
			const name = link.allergen?.name;
			if (name) set.add(name);
		});
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function mapRecipe(recipe: ApiRecipe): RecipeView {
	return {
		id: recipe.id,
		title: recipe.title,
		subtitle: recipe.description ?? "",
		imageUrl: resolveImageUrl(recipe.imageUrl),
		preparation: recipe.preparationMethod ?? "",
		difficultyLabel:
			(recipe.difficulty && DIFFICULTY_LABELS[recipe.difficulty]) ??
			recipe.difficulty ??
			"",
		timeLabel: recipe.preparationTimeMinutes
			? `${recipe.preparationTimeMinutes} minutos`
			: "",
		tags: (recipe.categories ?? [])
			.map((entry) => entry.category?.name)
			.filter((name): name is string => Boolean(name)),
		ingredients: (recipe.ingredients ?? []).map(buildIngredientLabel),
		allergens: collectAllergens(recipe.ingredients),
		authorName: recipe.author?.username ?? "",
	};
}

/**
 * Monta o multipart/form-data esperado pelo backend:
 * - campos escalares como string
 * - categoryIds / dietPreferenceIds / ingredients como string JSON
 * - arquivo opcional no campo "image"
 */
function buildRecipeFormData(payload: RecipePayload): FormData {
	const form = new FormData();
	form.append("title", payload.title);
	form.append("description", payload.description);
	form.append("preparationMethod", payload.preparationMethod);
	form.append(
		"preparationTimeMinutes",
		String(payload.preparationTimeMinutes)
	);
	form.append("difficulty", payload.difficulty);
	form.append("categoryIds", JSON.stringify(payload.categoryIds));
	form.append(
		"dietPreferenceIds",
		JSON.stringify(payload.dietPreferenceIds ?? [])
	);
	form.append("ingredients", JSON.stringify(payload.ingredients));
	if (payload.imageFile) {
		form.append("image", payload.imageFile);
	}
	return form;
}

export const recipeService = {
	/** Feed de swipe (receitas ainda não interagidas). */
	async getFeed(limit = 10): Promise<RecipeView[]> {
		const data = await apiRequest<ApiRecipe[]>(
			`/interactions/feed?limit=${limit}`,
			{ auth: true }
		);
		return data.map(mapRecipe);
	},

	/** Uma receita específica mapeada para a UI (Tela 8). */
	async getById(id: string): Promise<RecipeView> {
		const data = await apiRequest<ApiRecipe>(`/recipes/${id}`, { auth: true });
		return mapRecipe(data);
	},

	/** Receita crua (com IDs de categorias/ingredientes) para pré-preencher o form de edição. */
	async getRawById(id: string): Promise<ApiRecipeFull> {
		return apiRequest<ApiRecipeFull>(`/recipes/${id}`, { auth: true });
	},

	/** Receitas curtidas / smashs do usuário (Tela 7). */
	async getLiked(): Promise<RecipeView[]> {
		const data = await apiRequest<ApiRecipe[]>("/users/me/smashs", {
			auth: true,
		});
		return data.map(mapRecipe);
	},

	/**
	 * Receitas criadas pelo usuário (Tela 10).
	 * Obs.: a API só expõe GET /recipes (apenas APPROVED), então filtramos pelo autor
	 * no cliente. Receitas PENDING não aparecem até serem aprovadas.
	 */
	async getMine(authorId: string): Promise<RecipeView[]> {
		const data = await apiRequest<ApiRecipe[]>("/recipes", { auth: true });
		return data
			.filter((recipe) => (recipe.author?.id ?? recipe.authorId) === authorId)
			.map(mapRecipe);
	},

	/** Cria uma receita (Tela 11). Nasce com status PENDING. Envia multipart com a imagem. */
	async create(payload: RecipePayload): Promise<{ id: string }> {
		return apiRequest<{ id: string }>("/recipes", {
			method: "POST",
			body: buildRecipeFormData(payload),
			auth: true,
		});
	},

	/** Atualiza uma receita existente (envia multipart; imagem é opcional). */
	async update(id: string, payload: RecipePayload): Promise<{ id: string }> {
		return apiRequest<{ id: string }>(`/recipes/${id}`, {
			method: "PATCH",
			body: buildRecipeFormData(payload),
			auth: true,
		});
	},

	/** Remove uma receita. */
	async remove(id: string): Promise<void> {
		await apiRequest(`/recipes/${id}`, { method: "DELETE", auth: true });
	},

	/** Registra um swipe (SMASH/PASS). */
	async swipe(recipeId: string, type: InteractionType): Promise<void> {
		await apiRequest("/interactions/swipe", {
			method: "POST",
			body: { recipeId, type },
			auth: true,
		});
	},

	/** Desfaz a última interação. */
	async undo(): Promise<void> {
		await apiRequest("/interactions/undo", {
			method: "POST",
			auth: true,
		});
	},
};