import { apiRequest } from "./api";
import { ApiComment, RecipeComment } from "@/types/recipe";

function formatTimeAgo(iso: string): string {
	const diffMs = Date.now() - new Date(iso).getTime();
	const minutes = Math.floor(diffMs / 60000);

	if (minutes < 1) return "agora";
	if (minutes < 60) return `${minutes} min atrás`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} h atrás`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} d atrás`;

	return new Date(iso).toLocaleDateString("pt-BR");
}

export function mapComment(api: ApiComment): RecipeComment {
	return {
		id: api.id,
		author: api.user?.username ?? "Usuário",
		avatarUrl: api.user?.avatarUrl ?? undefined,
		timeAgo: formatTimeAgo(api.createdAt),
		text: api.content,
	};
}

export const commentService = {
	async getByRecipe(recipeId: string): Promise<RecipeComment[]> {
		const comments = await apiRequest<ApiComment[]>(
			`/comments/recipe/${recipeId}`
		);
		return comments.map(mapComment);
	},

	async create(recipeId: string, content: string): Promise<RecipeComment> {
		const comment = await apiRequest<ApiComment>(`/comments`, {
			method: "POST",
			auth: true,
			body: { recipeId, content },
		});
		return mapComment(comment);
	},
};