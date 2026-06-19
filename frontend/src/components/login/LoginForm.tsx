"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import styles from "./LoginForm.module.css";
import { authService } from "@/services/auth.service";
import { setToken } from "@/services/api";

type LoginUser = {
  id: string;
  name: string;
  username: string;
  role: string;
};

type LoginFormProps = {
  onLoginSuccess?: (user: LoginUser) => void;
};

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { accessToken, user } = await authService.login({ email, password });
      setToken(accessToken);

      if (onLoginSuccess) {
        onLoginSuccess(user);
      } else {
        router.push("/select-account");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField
        label="Email"
        type="email"
        placeholder="exemplo@email.com"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        label="Senha"
        type="password"
        placeholder="Use letras e números"
        value={password}
        onChangeText={setPassword}
      />

      {error && <p className={styles.error}>{error}</p>}

      <SubmitButton label="☆ Logar" isLoading={loading} />

      <p className={styles.registerHint}>
        Não possui uma conta?{" "}
        <Link href="/register" className={styles.registerLink}>
          Registre-se
        </Link>
      </p>
    </form>
  );
}