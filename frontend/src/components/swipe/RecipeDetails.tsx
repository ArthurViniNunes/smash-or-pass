import PreparationInstructions from "./PreparationInstructions";
import BadgeList from "./BadgeList";
import CommentSection from "./CommentSection";
import { RecipeComment, RecipeView } from "@/types/recipe";
import styles from "./RecipeDetails.module.css";

type RecipeDetailsProps = {
	recipe?: RecipeView;
	comments: RecipeComment[];
	commentsLoading?: boolean;
	/** Quando ausente, os comentários ficam somente leitura (caso da Tela 6). */
	onAddComment?: (text: string) => Promise<void>;
};

export default function RecipeDetails({
	recipe,
	comments,
	commentsLoading,
	onAddComment,
}: RecipeDetailsProps) {
	if (!recipe) {
		return (
			<div className={styles.content}>
				<p className={styles.placeholder}>
					Selecione uma receita para ver os detalhes.
				</p>
			</div>
		);
	}

	return (
		<div className={styles.content}>
			<PreparationInstructions text={recipe.preparation} />

			<div className={styles.divider} />
			<BadgeList title="tags" items={recipe.tags} />

			<div className={styles.divider} />
			<BadgeList title="ingredientes" items={recipe.ingredients} />

			<div className={styles.divider} />
			<CommentSection
				comments={comments}
				loading={commentsLoading}
				onAddComment={onAddComment}
			/>
		</div>
	);
}