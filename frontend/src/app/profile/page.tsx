import SideMenu from "@/components/swipe/SideMenu";
import ProfileContent from "@/components/profile/ProfileContent";
import styles from "./profile.module.css";

export default function ProfilePage() {
	return (
		<div className={styles.page}>
			<aside className={styles.menuWrap}>
				<SideMenu active="conta" />
			</aside>

			<main className={styles.main}>
				<ProfileContent />
			</main>
		</div>
	);
}