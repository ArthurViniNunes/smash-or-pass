import styles from "@/components/welcome/welcome.module.css";
import { OnboardingSection } from "@/components/welcome/OnboardingSection";
import { AuthSection } from "@/components/welcome/AuthSection";

// Mock enquanto o backend não fornece. Troque por /recipes futuramente.
const RECIPES = [
  { id: 1, imageUrl: "/images/recipes/r1.png" },
  { id: 2, imageUrl: "/images/recipes/r2.png" },
  { id: 3, imageUrl: "/images/recipes/r3.png" },
  { id: 4, imageUrl: "/images/recipes/r4.png" },
  { id: 5, imageUrl: "/images/recipes/r5.png" },
  { id: 6, imageUrl: "/images/recipes/r6.png" },
];
const USER_AVATAR = "/images/avatar.png";

export default function WelcomeAuthPage() {
  return (
    <main className={styles.page}>
      <OnboardingSection
        recipes={RECIPES}
        userAvatar={USER_AVATAR}
        message={"Conheça muitas\nreceitas aqui!"}
      />
      <AuthSection />
    </main>
  );
}