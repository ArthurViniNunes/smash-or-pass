"use client";

import styles from "./CategoryChips.module.css";

type CategoryChipsProps = {
	categories: string[];
	active: string;
	onSelect: (value: string) => void;
};

export default function CategoryChips({
	categories,
	active,
	onSelect,
}: CategoryChipsProps) {
	const options = ["Todos", ...categories];

	return (
		<div className={styles.row}>
			{options.map((option) => (
				<button
					key={option}
					type="button"
					className={`${styles.chip} ${active === option ? styles.active : ""}`}
					onClick={() => onSelect(option)}
				>
					{option}
				</button>
			))}
		</div>
	);
}