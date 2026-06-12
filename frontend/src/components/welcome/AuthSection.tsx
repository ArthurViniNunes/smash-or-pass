"use client";

import { useRouter } from "next/navigation";
import styles from "./welcome.module.css";
import { BrandLogo } from "@/components/BrandLogo";
import { LoginButton } from "./LoginButton";
import { RegisterLink } from "./RegisterLink";

export function AuthSection() {
  const router = useRouter();

  return (
    <section className={styles.panel}>
      <BrandLogo size={120} className={styles.logoBig} />
      <LoginButton label="Acesse sua conta" onPress={() => router.push("/login")} />
      <RegisterLink text="Não possui uma conta?" linkText="Registre-se" href="/register" />
    </section>
  );
}