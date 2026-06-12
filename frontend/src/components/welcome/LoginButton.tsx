"use client";

import { useState } from "react";
import styles from "./welcome.module.css";

type Props = { label: string; onPress: () => void | Promise<void> };

export function LoginButton({ label, onPress }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);
      await onPress();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={isLoading}
    >
      <span className={styles.dot} aria-hidden="true" />
      {isLoading ? "Entrando..." : label}
    </button>
  );
}