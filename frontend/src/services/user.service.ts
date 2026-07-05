import { apiRequest } from "./api";
import type { AuthUser } from "@/types/auth";
import type { AdminUser } from "@/types/admin";

export type UpdateProfilePayload = {
	name?: string;
	bio?: string;
};

export const userService = {
	/** Lista todos os usuários (GET /users, restrito a admin). */
	async listUsers(): Promise<AdminUser[]> {
		return apiRequest<AdminUser[]>("/users", { auth: true });
	},

	/** Atualiza o perfil do usuário autenticado (PATCH /users/me). */
	async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
		return apiRequest<AuthUser>("/users/me", {
			method: "PATCH",
			body: payload,
			auth: true,
		});
	},

	/**
	 * Atualiza o avatar do usuário via upload de arquivo
	 * (PATCH /users/me/avatar, multipart/form-data com o campo "avatar").
	 * O backend processa a imagem (WebP) e remove o avatar anterior.
	 */
	async updateAvatar(file: File): Promise<AuthUser> {
		const formData = new FormData();
		formData.append("avatar", file);

		return apiRequest<AuthUser>("/users/me/avatar", {
			method: "PATCH",
			body: formData,
			auth: true,
		});
	},
};