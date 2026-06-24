import type { RecipeComment } from "@/types/recipe";
import styles from "./CommentCard.module.css";

export default function CommentCard({ comment }: { comment: RecipeComment }) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.avatar} style={buildAvatarStyle(comment.avatarUrl)} />
        <p className={styles.meta}>
          <span className={styles.author}>{comment.author}</span> added a comment {comment.timeAgo}
        </p>
      </header>
      <p className={styles.text}>{comment.text}</p>
      <div className={styles.attachment} />
    </article>
  );
}

function buildAvatarStyle(url?: string) {
  if (!url) return undefined;
  return { backgroundImage: `url(${url})` };
}