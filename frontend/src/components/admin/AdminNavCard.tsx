"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminNavCard.module.css";

type Accent = "coral" | "violet" | "pink";

interface AdminNavCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  accent?: Accent;
  badge?: number;
}

export default function AdminNavCard({
  title,
  description,
  icon,
  href,
  accent = "coral",
  badge,
}: AdminNavCardProps) {
  const router = useRouter();
  const showBadge = typeof badge === "number" && badge > 0;

  return (
    <button
      type="button"
      className={`${styles.card} ${styles[accent]}`}
      onClick={() => router.push(href)}
    >
      <span className={styles.iconWrap}>
        {icon}
        {showBadge ? <span className={styles.badge}>{badge}</span> : null}
      </span>

      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>

      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </button>
  );
}