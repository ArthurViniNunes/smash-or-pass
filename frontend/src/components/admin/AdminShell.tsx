"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/services/api";
import { HomeIcon, DashboardIcon, RecipesIcon, UsersIcon } from "./AdminIcons";
import styles from "./AdminShell.module.css";

type AdminNavKey = "overview" | "dashboard" | "recipes" | "users";

interface AdminShellProps {
  active?: AdminNavKey;
  children: ReactNode;
}

const NAV_ITEMS: {
  key: AdminNavKey;
  label: string;
  href: string;
  icon: ReactNode;
}[] = [
  { key: "overview", label: "Visão geral", href: "/admin", icon: <HomeIcon /> },
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    key: "recipes",
    label: "Receitas",
    href: "/admin/recipes",
    icon: <RecipesIcon />,
  },
  { key: "users", label: "Usuários", href: "/admin/users", icon: <UsersIcon /> },
];

export default function AdminShell({ active, children }: AdminShellProps) {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>SP</span>
          <span className={styles.brandText}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`${styles.navItem} ${
                active === item.key ? styles.navItemActive : ""
              }`}
              onClick={() => router.push(item.href)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.exit}
            onClick={() => router.push("/select-account")}
          >
            ← Trocar conta
          </button>

          <button
            type="button"
            className={styles.logout}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}