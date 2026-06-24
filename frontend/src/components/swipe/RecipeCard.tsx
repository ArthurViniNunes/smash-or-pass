import styles from "./RecipeCard.module.css";

type RecipeCardProps = {
	title: string;
	subtitle?: string;
	imageUrl?: string;
	timeLabel?: string;
	difficultyLabel?: string;
};

function buildImageStyle(imageUrl?: string) {
	if (!imageUrl) return undefined;
	return { backgroundImage: `url(${imageUrl})` };
}

export default function RecipeCard({
	title,
	subtitle,
	imageUrl,
	timeLabel,
	difficultyLabel,
}: RecipeCardProps) {
	return (
		<div className={styles.card} style={buildImageStyle(imageUrl)}>
			<div className={styles.gradient} />
			<div className={styles.info}>
				<div className={styles.meta}>
					{timeLabel && <span className={styles.pill}>{timeLabel}</span>}
					{difficultyLabel && (
						<span className={styles.pill}>{difficultyLabel}</span>
					)}
				</div>
				<h2 className={styles.title}>{title}</h2>
				{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
			</div>
		</div>
	);
}