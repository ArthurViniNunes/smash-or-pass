export type AuthUser = {
	id: string;
	name: string;
	username: string;
	email?: string;
	role: string;
	avatarUrl?: string | null;
	bio?: string | null;
};

export type RegisterData = {
	name: string;
	username: string;
	email: string;
	password: string;
};

export type LoginData = {
	email: string;
	password: string;
};

export type LoginResponse = {
	accessToken: string;
	user: AuthUser;
};