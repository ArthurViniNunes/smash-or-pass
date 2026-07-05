"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminGuard } from "./useAdminGuard";
import { userService } from "@/services/user.service";
import type { AdminUser, UserRole } from "@/types/admin";
import AdminShell from "./AdminShell";
import AdminUserRow from "./AdminUserRow";
import styles from "./UsersAdminView.module.css";

type Tab = "all" | UserRole;

const TAB_LABELS: Record<Tab, string> = {
  all: "Todos",
  USER: "Usuários",
  ADMIN: "Administradores",
};

const TABS: Tab[] = ["all", "USER", "ADMIN"];

export default function UsersAdminView() {
  const { checking } = useAdminGuard();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);

    return userService
      .listUsers()
      .then((result) => setUsers(result))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (checking) return;
    load();
  }, [checking, load]);

  const counts = useMemo(
    () => ({
      all: users.length,
      USER: users.filter((u) => u.role === "USER").length,
      ADMIN: users.filter((u) => u.role === "ADMIN").length,
    }),
    [users]
  );

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesTab = tab === "all" ? true : user.role === tab;
      const matchesTerm =
        term === "" ||
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);

      return matchesTab && matchesTerm;
    });
  }, [users, tab, search]);

  return (
    <AdminShell active="users">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Painel administrativo</span>
            <h1 className={styles.title}>Usuários</h1>
            <p className={styles.subtitle}>
              Consulte todas as contas cadastradas no sistema.
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

        <input
          type="search"
          className={styles.search}
          placeholder="Buscar por nome, usuário ou e-mail…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className={styles.tabs}>
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.tab} ${tab === key ? styles.tabActive : ""}`}
              onClick={() => setTab(key)}
            >
              {TAB_LABELS[key]}
              <span className={styles.tabCount}>{counts[key]}</span>
            </button>
          ))}
        </div>

        {error ? (
          <div className={styles.errorBox}>
            Não foi possível carregar os usuários.{" "}
            <button type="button" onClick={() => load()} className={styles.retry}>
              Tentar novamente
            </button>
          </div>
        ) : loading ? (
          <p className={styles.placeholder}>Carregando usuários…</p>
        ) : list.length === 0 ? (
          <p className={styles.placeholder}>
            {users.length === 0
              ? "Nenhum usuário cadastrado ainda."
              : "Nenhum usuário encontrado para o filtro atual."}
          </p>
        ) : (
          <div className={styles.list}>
            {list.map((user) => (
              <AdminUserRow key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
