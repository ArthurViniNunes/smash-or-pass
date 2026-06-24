"use client";

import { useState, type SyntheticEvent } from "react";
import CommentCard from "./CommentCard";
import { RecipeComment } from "@/types/recipe";
import styles from "./CommentSection.module.css";

type CommentSectionProps = {
	comments: RecipeComment[];
	loading?: boolean;
	/**
	 * Quando ausente, a seção fica SOMENTE LEITURA.
	 * Comentar (e anexar foto) só é liberado na página da receita curtida (Tela 8),
	 * após o usuário ter dado like.
	 */
	onAddComment?: (text: string) => Promise<void>;
	lockedHint?: string;
};

export default function CommentSection({
	comments,
	loading,
	onAddComment,
	lockedHint = "Curta a receita para comentar e enviar uma foto.",
}: CommentSectionProps) {
	const [text, setText] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const canComment = typeof onAddComment === "function";

	async function handleSubmit(event: SyntheticEvent) {
		event.preventDefault();
		if (!onAddComment) return;

		const trimmed = text.trim();
		if (!trimmed || submitting) return;

		setSubmitting(true);
		setError(null);
		try {
			await onAddComment(trimmed);
			setText("");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Não foi possível enviar o comentário."
			);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<section className={styles.section}>
			<h3 className={styles.heading}>Comentários</h3>

			{canComment ? (
				<form className={styles.form} onSubmit={handleSubmit}>
					<textarea
						className={styles.input}
						placeholder="Escreva um comentário…"
						value={text}
						onChange={(event) => setText(event.target.value)}
						rows={2}
						maxLength={500}
					/>
					<button
						type="submit"
						className={styles.submit}
						disabled={submitting || !text.trim()}
					>
						{submitting ? "Enviando…" : "Comentar"}
					</button>
				</form>
			) : (
				<p className={styles.locked}>🔒 {lockedHint}</p>
			)}

			{error && <p className={styles.error}>{error}</p>}

			{loading ? (
				<p className={styles.state}>Carregando comentários…</p>
			) : comments.length === 0 ? (
				<p className={styles.state}>Nenhum comentário ainda.</p>
			) : (
				<div className={styles.list}>
					{comments.map((comment) => (
						<CommentCard key={comment.id} comment={comment} />
					))}
				</div>
			)}
		</section>
	);
}