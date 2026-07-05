"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SideMenu from "@/components/swipe/SideMenu";
import RecipeGridCard from "@/components/recipes/RecipeGridCard";
import CategoryChips from "@/components/recipes/CategoryChips";
import { authService } from "@/services/auth.service";
import { recipeService } from "@/services/recipe.service";
import type { RecipeView } from "@/types/recipe";
import styles from "./mine.module.css";

export default function MyRecipesPage() {
	const router = useRouter();
	const [recipes, setRecipes] = useState<RecipeView[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState("Todos");

	useEffect(() => {
		let active = true;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const me = await authService.me();
				const mine = await recipeService.getMine(me.id);
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

	// Categorias reais presentes nas receitas (para os chips)
	const categories = useMemo(() => {
		const set = new Set<string>();
		recipes.forEach((recipe) => {
			recipe.tags.forEach((tag) => {
				const value = tag.trim();
				if (value) set.add(value);
			});
		});
		return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
	}, [recipes]);

	// Filtro por categoria (client-side)
	const filtered = useMemo(() => {
		if (activeCategory === "Todos") return recipes;
		return recipes.filter((recipe) =>
			recipe.tags.some((tag) => tag.trim() === activeCategory)
		);
	}, [recipes, activeCategory]);

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
					<CategoryChips
						categories={categories}
						active={activeCategory}
						onSelect={setActiveCategory}
					/>
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
					<p className={styles.state}>Nenhuma receita nessa categoria.</p>
				) : (
					<div className={styles.grid}>
						{filtered.map((recipe) => (
							<RecipeGridCard
								key={recipe.id}
								recipe={recipe}
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
