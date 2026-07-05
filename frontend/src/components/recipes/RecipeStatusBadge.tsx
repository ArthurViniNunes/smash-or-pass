import type { RecipeStatus } from "@/types/recipe";
import styles from "./RecipeStatusBadge.module.css";

const STATUS_LABELS: Record<RecipeStatus, string> = {
	PENDING: "Pendente",
	APPROVED: "Aprovada",
	REJECTED: "Rejeitada",
};

const STATUS_CLASSES: Record<RecipeStatus, string> = {
	PENDING: styles.pending,
	APPROVED: styles.approved,
	REJECTED: styles.rejected,
};

export default function RecipeStatusBadge({
	status,
}: {
	status: RecipeStatus;
}) {
	return (
		<span className={`${styles.badge} ${STATUS_CLASSES[status]}`}>
			{STATUS_LABELS[status]}
		</span>
	);
}
