import type { ReactNode } from "react";
import styles from "./AdminStatCard.module.css";

type Accent = "coral" | "violet" | "pink" | "amber";

interface AdminStatCardProps {
  label: string;
  value?: number;
  loading?: boolean;
  icon: ReactNode;
  accent?: Accent;
}

export default function AdminStatCard({
  label,
  value,
  loading = false,
  icon,
  accent = "coral",
}: AdminStatCardProps) {
  return (
    <div className={`${styles.card} ${styles[accent]}`}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.info}>
        <span className={styles.value}>
          {loading ? (
            <span className={styles.skeleton} />
          ) : (
            (value ?? 0).toLocaleString("pt-BR")
          )}
        </span>
        <span className={styles.label}>{label}</span>
      </span>
    </div>
  );
}