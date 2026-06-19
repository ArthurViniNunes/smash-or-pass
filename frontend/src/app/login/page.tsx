import {BrandLogo} from "@/components/BrandLogo";
import InfoSection from "@/components/auth/InfoSection";
import LoginForm from "@/components/login/LoginForm";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <InfoSection
        backgroundImage="/images/register-bg.png"
        sloganText={"Pronto para\no próximo banquete?\nAcesse sua conta!"}
      />

      <section className={styles.formSide}>
        <BrandLogo size={120} className={styles.logo} />
        <h1 className={styles.title}>Sua cozinha te espera.</h1>
        <LoginForm />
      </section>
    </main>
  );
}