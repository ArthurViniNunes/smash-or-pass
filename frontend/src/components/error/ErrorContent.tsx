"use client";

import { useRouter } from "next/navigation";
import {BrandLogo} from "@/components/BrandLogo";
import ActionButton from "@/components/ui/ActionButton";
import { getToken } from "@/services/api";
import { authService } from "@/services/auth.service";
import styles from "./ErrorContent.module.css";

type ErrorContentProps = {
  code?: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function ErrorContent({
  code = "404",
  title,
  message,
  actionLabel = "Voltar para o início",
  actionHref = "/",
}: ErrorContentProps) {
  const router = useRouter();

  async function handleAction() {
    // Visitante (sem token) vai para a tela inicial.
    if (!getToken()) {
      router.push(actionHref);
      return;
    }

    // Usuário logado volta para a home do papel dele.
    // Se o token estiver expirado/inválido, o me() falha e mandamos para o início.
    try {
      const me = await authService.me();
      router.push(me.role === "ADMIN" ? "/select-account" : "/swipe");
    } catch {
      router.push(actionHref);
    }
  }

  return (
    <div className={styles.content}>
      <BrandLogo size={96} />
      <p className={styles.code}>{code}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      <ActionButton
        label={actionLabel}
        onClick={handleAction}
      />
    </div>
  );
}