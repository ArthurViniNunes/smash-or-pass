import RecipeCard from "./RecipeCard";
import SwipeControls from "./SwipeControls";
import FilterButton from "./FilterButton";
import { RecipeView } from "@/types/recipe";
import styles from "./SwipeArea.module.css";

type SwipeAreaProps = {
	recipe?: RecipeView;
	loading?: boolean;
	error?: string | null;
	empty?: boolean;
	disabled?: boolean;
	onPass?: () => void;
	onSmash?: () => void;
	onFilter?: () => void;
};

export default function SwipeArea({
	recipe,
	loading,
	error,
	empty,
	disabled,
	onPass,
	onSmash,
	onFilter,
}: SwipeAreaProps) {
	return (
		<div className={styles.area}>
			<div className={styles.topbar}>
				<FilterButton onClick={onFilter} />
			</div>

			<div className={styles.stage}>
				{loading ? (
					<div className={styles.state}>Carregando receitas…</div>
				) : error ? (
					<div className={styles.state}>{error}</div>
				) : empty || !recipe ? (
					<div className={styles.state}>
						Acabaram as receitas por aqui! Volte mais tarde. 🍽️
					</div>
				) : (
					<div className={styles.card}>
						<RecipeCard
							title={recipe.title}
							subtitle={recipe.subtitle}
							imageUrl={recipe.imageUrl}
							timeLabel={recipe.timeLabel}
							difficultyLabel={recipe.difficultyLabel}
						/>
						<div className={styles.controls}>
							<SwipeControls
								disabled={disabled}
								onPass={onPass}
								onSmash={onSmash}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}