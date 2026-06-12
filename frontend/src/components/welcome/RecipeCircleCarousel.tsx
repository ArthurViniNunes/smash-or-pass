import styles from "./welcome.module.css";

type Recipe = { id: string | number; imageUrl: string };
type Props = { recipes: Recipe[]; userAvatar: string };

const POSITIONS = [styles.p1, styles.p2, styles.p3, styles.p4, styles.p5, styles.p6];

export function RecipeCircleCarousel({ recipes, userAvatar }: Props) {
  return (
    <div className={styles.ring}>
      <span className={styles.orbit} aria-hidden="true" />
      <span className={styles.disc} aria-hidden="true" />

      {recipes.slice(0, POSITIONS.length).map((recipe, i) => (
        <span key={recipe.id} className={`${styles.thumb} ${POSITIONS[i]}`}>
          <img src={recipe.imageUrl} alt="" />
        </span>
      ))}

      <span className={styles.center}>
        <img src={userAvatar} alt="" />
      </span>
    </div>
  );
}