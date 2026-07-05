"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { clearToken } from "@/services/api";
import { resolveImageUrl } from "@/services/recipe.service";
import type { AuthUser } from "@/types/auth";
import UserBanner from "./UserBanner";
import SettingsSection, { type SettingOption } from "./SettingsSection";
import {
	ProfileIcon,
	RecipesIcon,
	PreferencesIcon,
	NotificationsIcon,
	LogoutIcon,
	HelpIcon,
	AboutIcon,
} from "./ProfileIcons";
import styles from "./ProfileContent.module.css";

export default function ProfileContent() {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const data = await authService.me();
				if (active) setUser(data);
			} catch (err) {
				if (active) {
					setError(
						err instanceof Error
							? err.message
							: "Não foi possível carregar seu perfil."
					);
				}
			} finally {
				if (active) setLoading(false);
			}
		}

		load();

		return () => {
			active = false;
		};
	}, []);

	function handleLogout() {
		clearToken();
		router.push("/login");
	}

	if (loading) {
		return <p className={styles.state}>Carregando seu perfil…</p>;
	}

	if (error) {
		return <p className={styles.state}>{error}</p>;
	}

	if (!user) return null;

	const mainOptions: SettingOption[] = [
		{
			icon: <ProfileIcon />,
			title: "Meu perfil",
			subtitle: "Mude seu perfil",
			onClick: () => router.push("/profile/edit"),
		},
		{
			icon: <RecipesIcon />,
			title: "Minhas receitas",
			subtitle: "Crie e edite suas receitas",
			onClick: () => router.push("/recipes/mine"),
		},
		{ icon: <PreferencesIcon />, title: "Preferências Alimentares" },
		{ icon: <NotificationsIcon />, title: "Notificações" },
		{
			icon: <LogoutIcon />,
			title: "Log out",
			subtitle: "Encerre sua sessão com segurança",
			onClick: handleLogout,
		},
	];

	const moreOptions: SettingOption[] = [
		{ icon: <HelpIcon />, title: "Help & Support" },
		{ icon: <AboutIcon />, title: "About App" },
	];

	return (
		<div className={styles.container}>
			<h1 className={styles.pageTitle}>Profile</h1>

			<UserBanner
				avatar={resolveImageUrl(user.avatarUrl ?? undefined)}
				name={user.name}
				username={user.username}
			/>

			<SettingsSection options={mainOptions} />
			<SettingsSection title="More" options={moreOptions} />
		</div>
	);
}