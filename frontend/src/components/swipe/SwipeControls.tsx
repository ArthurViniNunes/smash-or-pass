"use client";

import { CloseIcon, HeartIcon } from "./SwipeIcons";
import styles from "./SwipeControls.module.css";

type SwipeControlsProps = {
	onPass?: () => void;
	onSmash?: () => void;
	disabled?: boolean;
};

export default function SwipeControls({
	onPass,
	onSmash,
	disabled,
}: SwipeControlsProps) {
	return (
		<div className={styles.controls}>
			<button
				type="button"
				className={`${styles.button} ${styles.pass}`}
				onClick={onPass}
				disabled={disabled}
				aria-label="Passar receita"
			>
				<CloseIcon size={28} />
			</button>
			<button
				type="button"
				className={`${styles.button} ${styles.smash}`}
				onClick={onSmash}
				disabled={disabled}
				aria-label="Curtir receita"
			>
				<HeartIcon size={28} />
			</button>
		</div>
	);
}