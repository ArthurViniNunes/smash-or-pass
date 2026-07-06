import Link from "next/link";
import type { ReactNode } from "react";
import type { RecipeView } from "@/types/recipe";
import styles from "./RecipeGridCard.module.css";

export default function RecipeGridCard({
	recipe,
	footer,
	badge,
	linkable = true,
}: {
	recipe: RecipeView;
	// Slot opcional renderizado abaixo do card (irmão do <Link>, nunca aninhado
	// dentro dele). Permite que cada contexto adicione ações — ex.: "Editar" em
	// Minhas Receitas — sem o card conhecer essas ações. Curtidas não passa nada.
	footer?: ReactNode;
	// Selo opcional sobreposto à imagem — ex.: status de moderação em Minhas
	// Receitas. Curtidas não passa nada.
	badge?: ReactNode;
	// Quando false, o card não vira link para o detalhe (ex.: receitas
	// pendentes/reprovadas, que não existem na rota pública). Default: true.
	linkable?: boolean;
}) {
	const content = (
		<>
			<div className={styles.image} style={buildImageStyle(recipe.imageUrl)}>
				{badge ? <div className={styles.badge}>{badge}</div> : null}
			</div>
			<div className={styles.body}>
				<h3 className={styles.title}>{recipe.title}</h3>
				<p className={styles.meta}>
					<ClockIcon /> {recipe.timeLabel}
				</p>
				<p className={styles.meta}>
					<LevelIcon /> {recipe.difficultyLabel}
				</p>
			</div>
		</>
	);

	return (
		<div className={styles.card}>
			{linkable ? (
				<Link href={`/recipes/${recipe.id}`} className={styles.link}>
					{content}
				</Link>
			) : (
				<div className={styles.link}>{content}</div>
			)}

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