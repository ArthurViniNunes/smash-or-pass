"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import styles from "./RegisterForm.module.css";
import { authService } from "@/services/auth.service";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // validações espelhando o schema do backend
    if (name.trim().length < 3) {
      setError("O nome precisa ter pelo menos 3 caracteres.");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError("Usuário: 3 a 30 caracteres, apenas letras, números e _.");
      return;
    }
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!acceptedTerms) {
      setError("Você precisa aceitar os Termos e Condições.");
      return;
    }

    setLoading(true);
    try {
      await authService.register({ name, username, email, password });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField
        label="Nome"
        placeholder="Seu nome completo"
        value={name}
        onChangeText={setName}
      />
      <InputField
        label="Usuário"
        placeholder="ex.: jr_almeida"
        value={username}
        onChangeText={setUsername}
      />
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
        placeholder="Mínimo de 8 caracteres"
        value={password}
        onChangeText={setPassword}
      />
      <InputField
        label="Confirme sua senha"
        type="password"
        placeholder="Repita a senha novamente"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <label className={styles.terms}>
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
        />
        <span>
          Ao selecionar você concorda com os Termos e Condições de uso.{" "}
          <a href="/termos" className={styles.termsLink}>Saiba mais</a>
        </span>
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <SubmitButton label="Registrar" isLoading={loading} />
    </form>
  );
}