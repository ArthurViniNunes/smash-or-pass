"use client";

import { useEffect, useMemo, useState } from "react";
import SideMenu from "@/components/swipe/SideMenu";
import RecipeGridCard from "@/components/recipes/RecipeGridCard";
import CategoryChips from "@/components/recipes/CategoryChips";
import { recipeService } from "@/services/recipe.service";
import type { RecipeView } from "@/types/recipe";
import styles from "./recipes.module.css";

export default function LikedRecipesPage() {
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
				const data = await recipeService.getLiked();
				if (active) setRecipes(data);
			} catch (err) {
				if (active) {
					setError(
						err instanceof Error
							? err.message
							: "Não foi possível carregar suas curtidas."
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

	// Categorias reais presentes nas receitas curtidas (para os chips)
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
				<SideMenu active="curtidas" />
			</aside>

			<main className={styles.main}>
				<header>
					<h1 className={styles.title}>Curtidas</h1>
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
					<p className={styles.state}>Carregando suas curtidas…</p>
				) : recipes.length === 0 ? (
					<p className={styles.state}>
						Você ainda não curtiu nenhuma receita. Vá deslizar no swipe! 🍽️
					</p>
				) : filtered.length === 0 ? (
					<p className={styles.state}>Nenhuma receita nessa categoria.</p>
				) : (
					<div className={styles.grid}>
						{filtered.map((recipe) => (
							<RecipeGridCard key={recipe.id} recipe={recipe} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}