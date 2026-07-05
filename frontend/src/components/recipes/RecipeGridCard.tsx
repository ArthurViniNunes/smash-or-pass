import Link from "next/link";
import type { ReactNode } from "react";
import type { RecipeView } from "@/types/recipe";
import styles from "./RecipeGridCard.module.css";

export default function RecipeGridCard({
	recipe,
	footer,
}: {
	recipe: RecipeView;
	// Slot opcional renderizado abaixo do card (irmão do <Link>, nunca aninhado
	// dentro dele). Permite que cada contexto adicione ações — ex.: "Editar" em
	// Minhas Receitas — sem o card conhecer essas ações. Curtidas não passa nada.
	footer?: ReactNode;
}) {
	return (
		<div className={styles.card}>
			<Link href={`/recipes/${recipe.id}`} className={styles.link}>
				<div className={styles.image} style={buildImageStyle(recipe.imageUrl)} />
				<div className={styles.body}>
					<h3 className={styles.title}>{recipe.title}</h3>
					<p className={styles.meta}>
						<ClockIcon /> {recipe.timeLabel}
					</p>
					<p className={styles.meta}>
						<LevelIcon /> {recipe.difficultyLabel}
					</p>
				</div>
			</Link>

			{footer ? <div className={styles.footer}>{footer}</div> : null}
		</div>
	);
}

function buildImageStyle(url?: string) {
	if (!url) return undefined;
	return { backgroundImage: `url(${url})` };
}

function ClockIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</svg>
	);
}

function LevelIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 17l6-6 4 4 7-7" />
			<path d="M14 7h6v6" />
		</svg>
	);
}