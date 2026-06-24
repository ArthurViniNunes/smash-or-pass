"use client";

import styles from "./AccountCard.module.css";

type AccountCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function AccountCard({
  title,
  description,
  icon,
  onClick,
}: AccountCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.icon}>{icon}</div>
    </button>
  );
}