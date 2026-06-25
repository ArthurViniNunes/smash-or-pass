import type { ReactNode } from "react";
import SettingItem from "./SettingItem";
import styles from "./SettingsSection.module.css";

export type SettingOption = {
	icon: ReactNode;
	title: string;
	subtitle?: string;
	onClick?: () => void;
};

type SettingsSectionProps = {
	title?: string;
	options: SettingOption[];
};

export default function SettingsSection({ title, options }: SettingsSectionProps) {
	return (
		<section className={styles.section}>
			{title && <p className={styles.title}>{title}</p>}

			<div className={styles.card}>
				{options.map((option) => (
					<SettingItem
						key={option.title}
						icon={option.icon}
						title={option.title}
						subtitle={option.subtitle}
						onClick={option.onClick}
					/>
				))}
			</div>
		</section>
	);
}