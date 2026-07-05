"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminGuard } from "./useAdminGuard";
import { moderationService } from "@/services/moderation.service";
import type { AdminRecipe, ModerationStatus } from "@/types/admin";
import AdminShell from "./AdminShell";
import AdminRecipeRow from "./AdminRecipeRow";
import styles from "./RecipesAdminView.module.css";

type Tab = "pending" | "approved" | "rejected";

const STATUS_FEEDBACK: Record<ModerationStatus, string> = {
  APPROVED: "aprovada",
  REJECTED: "rejeitada",
  PENDING: "movida para pendentes",
};

export default function RecipesAdminView() {
  const { checking } = useAdminGuard();

  const [pending, setPending] = useState<AdminRecipe[]>([]);
  const [approved, setApproved] = useState<AdminRecipe[]>([]);
  const [rejected, setRejected] = useState<AdminRecipe[]>([]);
  const [tab, setTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);

    return Promise.all([
      moderationService.getPending(),
      moderationService.getApprovedRecipes(),
      moderationService.getRejectedRecipes(),
    ])
      .then(([pendingResult, approvedResult, rejectedResult]) => {
        setPending(pendingResult.recipes);
        setApproved(approvedResult);
        setRejected(rejectedResult);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (checking) return;
    load();
  }, [checking, load]);

  function applyLocal(recipe: AdminRecipe, status: ModerationStatus) {
    setPending((prev) => {
      const without = prev.filter((r) => r.id !== recipe.id);
      return status === "PENDING" ? [{ ...recipe, status }, ...without] : without;
    });
    setApproved((prev) => {
      const without = prev.filter((r) => r.id !== recipe.id);
      return status === "APPROVED" ? [{ ...recipe, status }, ...without] : without;
    });
    setRejected((prev) => {
      const without = prev.filter((r) => r.id !== recipe.id);
      return status === "REJECTED" ? [{ ...recipe, status }, ...without] : without;
    });
  }

  async function changeStatus(recipe: AdminRecipe, status: ModerationStatus) {
    setActingId(recipe.id);
    setFeedback(null);
    try {
      await moderationService.setRecipeStatus(recipe.id, status);
      applyLocal(recipe, status);
      setFeedback(`Receita "${recipe.title}" ${STATUS_FEEDBACK[status]}.`);
    } catch {
      setFeedback("Não foi possível atualizar a receita.");
    } finally {
      setActingId(null);
    }
  }

  async function removeRecipe(recipe: AdminRecipe) {
    const confirmed = window.confirm(
      `Excluir a receita "${recipe.title}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    setActingId(recipe.id);
    setFeedback(null);
    try {
      await moderationService.deleteRecipe(recipe.id);
      setPending((prev) => prev.filter((r) => r.id !== recipe.id));
      setApproved((prev) => prev.filter((r) => r.id !== recipe.id));
      setRejected((prev) => prev.filter((r) => r.id !== recipe.id));
      setFeedback(`Receita "${recipe.title}" excluída.`);
    } catch {
      setFeedback("Não foi possível excluir a receita.");
    } finally {
      setActingId(null);
    }
  }

  const list =
    tab === "pending" ? pending : tab === "approved" ? approved : rejected;

  return (
    <AdminShell active="recipes">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Painel administrativo</span>
            <h1 className={styles.title}>Receitas</h1>
            <p className={styles.subtitle}>
              Modere as receitas pendentes e gerencie as que já estão publicadas.
            </p>
          </div>
          <button
            type="button"
            className={styles.refresh}
            onClick={() => load()}
            disabled={loading}
          >
            {loading ? "Atualizando…" : "Atualizar"}
          </button>
        </header>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === "pending" ? styles.tabActive : ""}`}
            onClick={() => setTab("pending")}
          >
            Pendentes
            <span className={styles.tabCount}>{pending.length}</span>
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "approved" ? styles.tabActive : ""}`}
            onClick={() => setTab("approved")}
          >
            Aprovadas
            <span className={styles.tabCount}>{approved.length}</span>
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "rejected" ? styles.tabActive : ""}`}
            onClick={() => setTab("rejected")}
          >
            Rejeitadas
            <span className={styles.tabCount}>{rejected.length}</span>
          </button>
        </div>

        {feedback ? (
          <div className={styles.feedback}>
            <span>{feedback}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className={styles.feedbackClose}
              aria-label="Fechar aviso"
            >
              ×
            </button>
          </div>
        ) : null}

        {error ? (
          <div className={styles.errorBox}>
            Não foi possível carregar as receitas.{" "}
            <button type="button" onClick={() => load()} className={styles.retry}>
              Tentar novamente
            </button>
          </div>
        ) : loading ? (
          <p className={styles.placeholder}>Carregando receitas…</p>
        ) : list.length === 0 ? (
          <p className={styles.placeholder}>
            {tab === "pending"
              ? "Nenhuma receita aguardando moderação. 🎉"
              : tab === "approved"
              ? "Nenhuma receita aprovada ainda."
              : "Nenhuma receita rejeitada."}
          </p>
        ) : (
          <div className={styles.list}>
            {list.map((recipe) =>
              tab === "pending" ? (
                <AdminRecipeRow
                  key={recipe.id}
                  recipe={recipe}
                  acting={actingId === recipe.id}
                  onApprove={() => changeStatus(recipe, "APPROVED")}
                  onReject={() => changeStatus(recipe, "REJECTED")}
                />
              ) : tab === "approved" ? (
                <AdminRecipeRow
                  key={recipe.id}
                  recipe={recipe}
                  acting={actingId === recipe.id}
                  onMakePending={() => changeStatus(recipe, "PENDING")}
                  onReject={() => changeStatus(recipe, "REJECTED")}
                />
              ) : (
                <AdminRecipeRow
                  key={recipe.id}
                  recipe={recipe}
                  acting={actingId === recipe.id}
                  onMakePending={() => changeStatus(recipe, "PENDING")}
                  onDelete={() => removeRecipe(recipe)}
                />
              )
            )}
          </div>
        )}

        <p className={styles.note}>
          Observação: rejeitar apenas altera o status da receita (reversível) — ela
          continua na aba &quot;Rejeitadas&quot;. Já &quot;Excluir&quot; remove a receita
          em definitivo.
        </p>
      </div>
    </AdminShell>
  );
}