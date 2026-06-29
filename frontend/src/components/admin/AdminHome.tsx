"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { dashboardService } from "@/services/dashboard.service";
import type { AuthUser } from "@/types/auth";
import type { DashboardMetrics } from "@/types/admin";
import AdminNavCard from "./AdminNavCard";
import AdminStatCard from "./AdminStatCard";
import {
  RecipesIcon,
  DashboardIcon,
  UsersIcon,
  PendingIcon,
  InteractionsIcon,
} from "./AdminIcons";
import styles from "./AdminHome.module.css";

export default function AdminHome() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [checking, setChecking] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState(false);

  // Guarda de rota: somente ADMIN entra aqui.
  useEffect(() => {
    let active = true;

    authService
      .me()
      .then((me) => {
        if (!active) return;
        if (me.role !== "ADMIN") {
          router.replace("/swipe");
          return;
        }
        setUser(me);
        setChecking(false);
      })
      .catch(() => router.replace("/login"));

    return () => {
      active = false;
    };
  }, [router]);

  // Carrega as métricas do sistema depois de validar o acesso.
  useEffect(() => {
    if (checking) return;
    let active = true;

    setLoadingMetrics(true);
    setMetricsError(false);

    dashboardService
      .getMetrics()
      .then((data) => {
        if (active) setMetrics(data);
      })
      .catch(() => {
        if (active) setMetricsError(true);
      })
      .finally(() => {
        if (active) setLoadingMetrics(false);
      });

    return () => {
      active = false;
    };
  }, [checking]);

  if (checking) {
    return (
      <main className={styles.page}>
        <p className={styles.loading}>Carregando painel…</p>
      </main>
    );
  }

  const firstName = user?.name?.trim().split(" ")[0] ?? "Admin";
  const pendingTotal = metrics
    ? metrics.pendingRecipes +
      metrics.pendingCategories +
      metrics.pendingIngredients
    : 0;
  const interactions = metrics ? metrics.smashes + metrics.passes : 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Painel administrativo</span>
          <h1 className={styles.title}>
            Olá, <span className={styles.titleAccent}>{firstName}</span> 👋
          </h1>
          <p className={styles.subtitle}>
            O que você gostaria de gerenciar hoje?
          </p>
        </header>

        <section className={styles.stats} aria-label="Resumo do sistema">
          {metricsError ? (
            <div className={styles.statsError}>
              Não foi possível carregar as métricas agora.
            </div>
          ) : (
            <div className={styles.statsGrid}>
              <AdminStatCard
                label="Usuários"
                value={metrics?.users}
                loading={loadingMetrics}
                icon={<UsersIcon />}
                accent="violet"
              />
              <AdminStatCard
                label="Receitas"
                value={metrics?.recipes}
                loading={loadingMetrics}
                icon={<RecipesIcon />}
                accent="coral"
              />
              <AdminStatCard
                label="Pendências"
                value={pendingTotal}
                loading={loadingMetrics}
                icon={<PendingIcon />}
                accent="amber"
              />
              <AdminStatCard
                label="Interações"
                value={interactions}
                loading={loadingMetrics}
                icon={<InteractionsIcon />}
                accent="pink"
              />
            </div>
          )}
        </section>

        <section className={styles.nav} aria-label="Áreas administrativas">
          <AdminNavCard
            title="Receitas"
            description="Modere e gerencie as receitas existentes no sistema."
            icon={<RecipesIcon />}
            href="/admin/recipes"
            accent="coral"
            badge={metrics?.pendingRecipes}
          />
          <AdminNavCard
            title="Dashboard"
            description="Acompanhe métricas gerais de usuários, receitas e interações."
            icon={<DashboardIcon />}
            href="/admin/dashboard"
            accent="violet"
          />
          <AdminNavCard
            title="Usuários"
            description="Visualize e gerencie as contas de usuários da plataforma."
            icon={<UsersIcon />}
            href="/admin/users"
            accent="pink"
          />
        </section>

        <button
          type="button"
          className={styles.backLink}
          onClick={() => router.push("/select-account")}
        >
          ← Voltar para seleção de conta
        </button>
      </div>
    </main>
  );
}