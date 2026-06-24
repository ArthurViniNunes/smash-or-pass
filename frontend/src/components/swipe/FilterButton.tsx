"use client";

import { FilterIcon } from "./SwipeIcons";
import styles from "./FilterButton.module.css";

export default function FilterButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <FilterIcon />
      <span>Filtros</span>
    </button>
  );
}