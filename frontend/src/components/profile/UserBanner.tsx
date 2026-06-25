import styles from "./UserBanner.module.css";

type UserBannerProps = {
	avatar?: string;
	name: string;
	username: string;
};

function buildHandle(username: string) {
	return username.startsWith("@") ? username : `@${username}`;
}

function buildAvatarStyle(avatar?: string) {
	if (!avatar) return undefined;
	return { backgroundImage: `url(${avatar})` };
}

export default function UserBanner({ avatar, name, username }: UserBannerProps) {
	return (
		<section className={styles.banner}>
			<span className={styles.avatar} style={buildAvatarStyle(avatar)}>
				{!avatar && (
					<span className={styles.initial}>
						{name.charAt(0).toUpperCase()}
					</span>
				)}
			</span>

			<div className={styles.info}>
				<p className={styles.name}>{name}</p>
				<p className={styles.handle}>{buildHandle(username)}</p>
			</div>
		</section>
	);
}