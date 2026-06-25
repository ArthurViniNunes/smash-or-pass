"use client";

import type { ReactNode } from "react";
import styles from "./SettingItem.module.css";

type SettingItemProps = {
	icon: ReactNode;
	title: string;
	subtitle?: string;
	onClick?: () => void;
};

function ChevronIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M9 6l6 6-6 6" />
		</svg>
	);
}

export default function SettingItem({
	icon,
	title,
	subtitle,
	onClick,
}: SettingItemProps) {
	return (
		<button
			type="button"
			className={styles.item}
			onClick={onClick}
			data-clickable={onClick ? "true" : "false"}
		>
			<span className={styles.icon}>{icon}</span>

			<span className={styles.texts}>
				<span className={styles.title}>{title}</span>
				{subtitle && <span className={styles.subtitle}>{subtitle}</span>}
			</span>

			<span className={styles.chevron}>
				<ChevronIcon />
			</span>
		</button>
	);
}