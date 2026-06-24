"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "@/components/swipe/SideMenu";
import SwipeArea from "@/components/swipe/SwipeArea";
import RecipeDetails from "@/components/swipe/RecipeDetails";
import { recipeService } from "@/services/recipe.service";
import { commentService } from "@/services/comment.service";
import { getToken } from "@/services/api";
import { InteractionType, RecipeComment, RecipeView } from "@/types/recipe";
import styles from "./swipe.module.css";

export default function SwipePage() {
	const router = useRouter();

	const [recipes, setRecipes] = useState<RecipeView[]>([]);
	const [index, setIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [comments, setComments] = useState<RecipeComment[]>([]);
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);

	const current = recipes[index];

	// 1) Feed (exige login)
	useEffect(() => {
		if (!getToken()) {
			router.replace("/login");
			return;
		}

		let active = true;

		(async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await recipeService.getFeed(10);
				if (active) {
					setRecipes(data);
					setIndex(0);
				}
			} catch (err) {
				if (active) {
					setError(
						err instanceof Error ? err.message : "Erro ao carregar receitas."
					);
				}
			} finally {
				if (active) setLoading(false);
			}
		})();

		return () => {
			active = false;
		};
	}, [router]);

	// 2) Comentários da receita atual (somente leitura nesta tela)
	useEffect(() => {
		if (!current) {
			setComments([]);
			return;
		}

		let active = true;
		setCommentsLoading(true);

		commentService
			.getByRecipe(current.id)
			.then((data) => active && setComments(data))
			.catch(() => active && setComments([]))
			.finally(() => active && setCommentsLoading(false));

		return () => {
			active = false;
		};
	}, [current]);

	// 3) Swipe (SMASH/PASS) + avança
	const handleSwipe = useCallback(
		async (type: InteractionType) => {
			if (!current || actionLoading) return;
			setActionLoading(true);
			try {
				await recipeService.swipe(current.id, type);
			} catch (err) {
				console.error("Falha ao registrar swipe:", err);
			} finally {
				setActionLoading(false);
				setIndex((prev) => prev + 1);
			}
		},
		[current, actionLoading]
	);

	return (
		<div className={styles.page}>
			<aside className={styles.menu}>
				<SideMenu active="swipe" />
			</aside>

			<main className={styles.swipe}>
				<SwipeArea
					recipe={current}
					loading={loading}
					error={error}
					empty={!loading && !error && !current}
					disabled={actionLoading}
					onPass={() => handleSwipe("PASS")}
					onSmash={() => handleSwipe("SMASH")}
				/>
			</main>

			{/* preparo → tags → ingredientes → comentários (read-only) */}
			<aside className={styles.details}>
				<RecipeDetails
					recipe={current}
					comments={comments}
					commentsLoading={commentsLoading}
				/>
			</aside>
		</div>
	);
}