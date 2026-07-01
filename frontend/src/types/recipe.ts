export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type InteractionType = "SMASH" | "PASS";

export type ApiAuthor = {
	id: string;
	username: string;
	avatarUrl?: string | null;
};

export type ApiCategoryLink = {
	recipeId: string;
	categoryId: string;
	category: { id: string; name: string; status?: string };
};

export type ApiDietPreferenceLink = {
	recipeId: string;
	dietPreferenceId: string;
	dietPreference: { id: string; name: string };
};

export type ApiAllergen = {
	id: string;
	name: string;
};

export type ApiIngredientAllergenLink = {
	ingredientId: string;
	allergenId: string;
	allergen: ApiAllergen;
};

export type ApiIngredientLink = {
	id: string;
	recipeId: string;
	ingredientId: string;
	quantity: number;
	unit: string;
	ingredient: {
		id: string;
		name: string;
		allergens?: ApiIngredientAllergenLink[];
	};
};

export type ApiComment = {
	id: string;
	content: string;
	recipeId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	user: { id: string; username: string; avatarUrl?: string | null };
};

export type ApiRecipe = {
	id: string;
	title: string;
	description: string;
	preparationMethod: string;
	preparationTimeMinutes: number;
	difficulty: Difficulty;
	imageUrl?: string | null;
	status: string;
	authorId: string;
	createdAt: string;
	updatedAt: string;
	author?: ApiAuthor;
	categories?: ApiCategoryLink[];
	dietPreferences?: ApiDietPreferenceLink[];
	ingredients?: ApiIngredientLink[];
	comments?: ApiComment[];
};

// ===== View-models (o que os componentes de UI realmente consomem) =====
export type RecipeComment = {
	id: string;
	author: string;
	avatarUrl?: string;
	timeAgo: string;
	text: string;
};

export type RecipeView = {
	id: string;
	title: string;
	subtitle: string;
	imageUrl?: string;
	preparation: string;
	difficultyLabel: string;
	timeLabel: string;
	tags: string[];
	ingredients: string[];
	allergens: string[];
	authorName: string;
};

// ===== Alérgenos (catálogo + perfil do usuário) =====
export type Allergen = {
	id: string;
	name: string;
};

// ===== Catálogo + payloads de escrita (Telas 10/11) =====
export type CatalogItem = {
	id: string;
	name: string;
};

export type RecipeIngredientInput = {
	ingredientId: string;
	quantity: number;
	unit: string;
};

export type RecipePayload = {
	title: string;
	description: string;
	preparationMethod: string;
	preparationTimeMinutes: number;
	difficulty: Difficulty;
	categoryIds: string[];
	dietPreferenceIds?: string[];
	ingredients: RecipeIngredientInput[];
	/** Arquivo de imagem a enviar (multipart). Opcional na edição. */
	imageFile?: File | null;
};