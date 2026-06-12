import styles from "./welcome.module.css";
import { RecipeCircleCarousel } from "./RecipeCircleCarousel";
import { WelcomeText } from "./WelcomeText";

type Recipe = { id: string | number; imageUrl: string };
type Props = { recipes: Recipe[]; userAvatar: string; message: string };

export function OnboardingSection({ recipes, userAvatar, message }: Props) {
  return (
    <section className={styles.hero}>
      <RecipeCircleCarousel recipes={recipes} userAvatar={userAvatar} />
      <WelcomeText message={message} />
    </section>
  );
}