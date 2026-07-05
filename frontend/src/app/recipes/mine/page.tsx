"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SideMenu from "@/components/swipe/SideMenu";
import RecipeGridCard from "@/components/recipes/RecipeGridCard";
import RecipeStatusBadge from "@/components/recipes/RecipeStatusBadge";
import { recipeService } from "@/services/recipe.service";
import type { RecipeStatus, RecipeView } from "@/types/recipe";
import styles from "./mine.module.css";

type StatusTab = "ALL" | RecipeStatus;

const TABS: { key: StatusTab; label: string }[] = [
	{ key: "ALL", label: "Todas" },
	{ key: "PENDING", label: "Pendentes" },
	{ key: "APPROVED", label: "Aprovadas" },
	{ key: "REJECTED", label: "Rejeitadas" },
];

export default function MyRecipesPage() {
	const router = useRouter();
	const [recipes, setRecipes] = useState<RecipeView[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<StatusTab>("ALL");

	useEffect(() => {
		let active = true;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const mine = await recipeService.getMine();
				if (active) setRecipes(mine);
			} catch (err) {
				if (active) {
					setError(
						err instanceof Error
							? err.message
							: "Não foi possível carregar suas receitas."
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

	// Contagem por status para os selos das tabs
	const counts = useMemo(
		() => ({
			ALL: recipes.length,
			PENDING: recipes.filter((r) => r.status === "PENDING").length,
			APPROVED: recipes.filter((r) => r.status === "APPROVED").length,
			REJECTED: recipes.filter((r) => r.status === "REJECTED").length,
		}),
		[recipes]
	);

	// Filtro por status (client-side)
	const filtered = useMemo(() => {
		if (activeTab === "ALL") return recipes;
		return recipes.filter((recipe) => recipe.status === activeTab);
	}, [recipes, activeTab]);

	return (
		<div className={styles.page}>
			<aside className={styles.menuWrap}>
				<SideMenu active="conta" />
			</aside>

			<main className={styles.main}>
				<header className={styles.header}>
					<h1 className={styles.title}>Minhas receitas</h1>
					<button
						type="button"
						className={styles.newButton}
						onClick={() => router.push("/recipes/new")}
					>
						+ Nova receita
					</button>
				</header>

				{!loading && !error && recipes.length > 0 && (
					<div className={styles.tabs}>
						{TABS.map((item) => (
							<button
								key={item.key}
								type="button"
								className={`${styles.tab} ${
									activeTab === item.key ? styles.tabActive : ""
								}`}
								onClick={() => setActiveTab(item.key)}
							>
								{item.label}
								<span className={styles.tabCount}>{counts[item.key]}</span>
							</button>
						))}
					</div>
				)}

				{error ? (
					<p className={styles.state}>{error}</p>
				) : loading ? (
					<p className={styles.state}>Carregando suas receitas…</p>
				) : recipes.length === 0 ? (
					<p className={styles.state}>
						Você ainda não tem receitas. Crie uma nova receita para começar. 🍽️
					</p>
				) : filtered.length === 0 ? (
					<p className={styles.state}>Nenhuma receita com esse status.</p>
				) : (
					<div className={styles.grid}>
						{filtered.map((recipe) => (
							<RecipeGridCard
								key={recipe.id}
								recipe={recipe}
								badge={<RecipeStatusBadge status={recipe.status} />}
								// Só receitas aprovadas existem na rota pública de detalhe;
								// pendentes/reprovadas não linkam (opção a). O footer "Editar"
								// dá ao dono o caminho para revisar/corrigir.
								linkable={recipe.status === "APPROVED"}
								footer={
									<Link
										href={`/recipes/${recipe.id}/edit`}
										className={styles.edit}
									>
										Editar
									</Link>
								}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
