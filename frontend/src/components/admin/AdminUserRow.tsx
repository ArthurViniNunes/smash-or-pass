"use client";

import type { CSSProperties } from "react";
import type { AdminUser, UserRole } from "@/types/admin";
import { resolveImageUrl } from "@/services/recipe.service";
import styles from "./AdminUserRow.module.css";

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Usuário",
  ADMIN: "Administrador",
};

function avatarStyle(url?: string): CSSProperties {
  return url ? { backgroundImage: `url(${url})` } : {};
}

function formatJoined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface AdminUserRowProps {
  user: AdminUser;
}

export default function AdminUserRow({ user }: AdminUserRowProps) {
  // A API devolve o avatar como caminho relativo (/uploads/...); prefixamos com
  // a API_URL para o browser buscá-lo no backend, e não no próprio frontend.
  const avatarUrl = resolveImageUrl(user.avatarUrl);
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";
  const joined = formatJoined(user.createdAt);
  const roleClass = user.role === "ADMIN" ? styles.roleAdmin : styles.roleUser;

  return (
    <article className={styles.row}>
      <div
        className={`${styles.avatar} ${avatarUrl ? "" : styles.avatarEmpty}`}
        style={avatarStyle(avatarUrl)}
      >
        {avatarUrl ? null : <span aria-hidden="true">{initial}</span>}
      </div>

      <div className={styles.info}>
        <div className={styles.titleLine}>
          <h3 className={styles.name}>{user.name}</h3>
          <span className={`${styles.role} ${roleClass}`}>
            {ROLE_LABELS[user.role]}
          </span>
        </div>

        <p className={styles.username}>@{user.username}</p>
        <p className={styles.email}>{user.email}</p>
      </div>

      {joined ? (
        <span className={styles.joined}>Entrou em {joined}</span>
      ) : null}
    </article>
  );
}
