"use client";

import type { CSSProperties } from "react";
import type { AdminRecipe, Difficulty, ModerationStatus } from "@/types/admin";
import { resolveImageUrl } from "@/services/recipe.service";
import styles from "./AdminRecipeRow.module.css";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: "Fácil",
  MEDIUM: "Médio",
  HARD: "Difícil",
};

const STATUS_LABELS: Record<ModerationStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

function thumbStyle(url?: string): CSSProperties {
  return url ? { backgroundImage: `url(${url})` } : {};
}

interface AdminRecipeRowProps {
  recipe: AdminRecipe;
  acting?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onMakePending?: () => void;
  onDelete?: () => void;
}

export default function AdminRecipeRow({
  recipe,
  acting = false,
  onApprove,
  onReject,
  onMakePending,
  onDelete,
}: AdminRecipeRowProps) {
  const author = recipe.author?.username ?? `#${recipe.authorId.slice(0, 8)}`;
  // A API devolve a imagem como caminho relativo (/uploads/...); precisamos
  // prefixar com a API_URL para o browser buscá-la no backend, e não no
  // próprio frontend.
  const imageUrl = resolveImageUrl(recipe.imageUrl);
  const statusClass =
    recipe.status === "APPROVED"
      ? styles.statusApproved
      : recipe.status === "REJECTED"
      ? styles.statusRejected
      : styles.statusPending;

  return (
    <article className={styles.row}>
      <div
        className={`${styles.thumb} ${imageUrl ? "" : styles.thumbEmpty}`}
        style={thumbStyle(imageUrl)}
      >
        {imageUrl ? null : <span aria-hidden="true">🍽</span>}
      </div>

      <div className={styles.info}>
        <div className={styles.titleLine}>
          <h3 className={styles.title}>{recipe.title}</h3>
          <span className={`${styles.status} ${statusClass}`}>
            {STATUS_LABELS[recipe.status]}
          </span>
        </div>

        <p className={styles.meta}>
          {DIFFICULTY_LABELS[recipe.difficulty]} · {recipe.preparationTimeMinutes}{" "}
          min · por {author}
        </p>

        <p className={styles.description}>{recipe.description}</p>
      </div>

      <div className={styles.actions}>
        {onApprove ? (
          <button
            type="button"
            className={`${styles.action} ${styles.approve}`}
            onClick={onApprove}
            disabled={acting}
          >
            Aprovar
          </button>
        ) : null}
        {onReject ? (
          <button
            type="button"
            className={`${styles.action} ${styles.reject}`}
            onClick={onReject}
            disabled={acting}
          >
            Rejeitar
          </button>
        ) : null}
        {onMakePending ? (
          <button
            type="button"
            className={`${styles.action} ${styles.neutral}`}
            onClick={onMakePending}
            disabled={acting}
          >
            Tornar pendente
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            className={`${styles.action} ${styles.danger}`}
            onClick={onDelete}
            disabled={acting}
          >
            Excluir
          </button>
        ) : null}
      </div>
    </article>
  );
}