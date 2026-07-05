"use client";

import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type SyntheticEvent,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { allergenService } from "@/services/allergen.service";
import { resolveImageUrl } from "@/services/recipe.service";
import type { AuthUser } from "@/types/auth";
import type { Allergen } from "@/types/recipe";
import styles from "./EditProfileForm.module.css";

const GENDER_OPTIONS = ["Feminino", "Masculino", "Outro", "Prefiro não dizer"];

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

function buildAvatarStyle(avatar?: string) {
	if (!avatar) return undefined;
	return { backgroundImage: `url(${avatar})` };
}

export default function EditProfileForm() {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [gender, setGender] = useState("");
	const [bio, setBio] = useState("");

	// Avatar via upload de arquivo
	const [existingAvatarUrl, setExistingAvatarUrl] = useState("");
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
		undefined
	);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Alergias e intolerâncias
	const [allAllergens, setAllAllergens] = useState<Allergen[]>([]);
	const [myAllergenIds, setMyAllergenIds] = useState<Set<string>>(
		() => new Set()
	);
	const [allergenBusy, setAllergenBusy] = useState<Set<string>>(
		() => new Set()
	);
	const [allergenError, setAllergenError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		async function load() {
			setLoading(true);
			setLoadError(null);
			try {
				const data = await authService.me();
				if (!active) return;
				setUser(data);
				const parts = data.name.trim().split(/\s+/);
				setFirstName(parts.shift() ?? "");
				setLastName(parts.join(" "));
				setBio(data.bio ?? "");
				setExistingAvatarUrl(data.avatarUrl ?? "");
			} catch (err) {
				if (active) {
					setLoadError(
						err instanceof Error
							? err.message
							: "Não foi possível carregar seu perfil."
					);
				}
			} finally {
				if (active) setLoading(false);
			}
		}

		load();

		return () => {
			active = false;
		};
	}, []);

	// Gera (e limpa) a URL de pré-visualização do arquivo escolhido
	useEffect(() => {
		if (!avatarFile) {
			setAvatarPreview(undefined);
			return;
		}
		const objectUrl = URL.createObjectURL(avatarFile);
		setAvatarPreview(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [avatarFile]);

	// Carrega catálogo de alérgenos + os que já estão no perfil
	useEffect(() => {
		let active = true;

		Promise.all([allergenService.getAll(), allergenService.getMine()])
			.then(([all, mine]) => {
				if (!active) return;
				setAllAllergens(all);
				setMyAllergenIds(new Set(mine.map((a) => a.id)));
			})
			.catch(() => {
				/* alergias são opcionais: falha silenciosa */
			});

		return () => {
			active = false;
		};
	}, []);

	function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
			setError("Formato inválido. Use imagens JPEG, PNG ou WebP.");
			return;
		}
		if (file.size > MAX_AVATAR_SIZE) {
			setError("A imagem deve ter no máximo 5 MB.");
			return;
		}

		setError(null);
		setAvatarFile(file);
	}

	function clearAvatarSelection() {
		setAvatarFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	async function toggleAllergen(id: string) {
		if (allergenBusy.has(id)) return;
		const isActive = myAllergenIds.has(id);

		setAllergenBusy((prev) => new Set(prev).add(id));
		setAllergenError(null);

		try {
			if (isActive) {
				await allergenService.remove(id);
				setMyAllergenIds((prev) => {
					const next = new Set(prev);
					next.delete(id);
					return next;
				});
			} else {
				await allergenService.add(id);
				setMyAllergenIds((prev) => new Set(prev).add(id));
			}
		} catch (err) {
			setAllergenError(
				err instanceof Error
					? err.message
					: "Não foi possível atualizar suas alergias."
			);
		} finally {
			setAllergenBusy((prev) => {
				const next = new Set(prev);
				next.delete(id);
				return next;
			});
		}
	}

	async function handleSubmit(event: SyntheticEvent) {
		event.preventDefault();
		const name = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
		if (name.length < 3) {
			setError("O nome completo deve ter ao menos 3 caracteres.");
			return;
		}

		setSaving(true);
		setError(null);

		try {
			await userService.updateProfile({ name, bio: bio.trim() });
			if (avatarFile) {
				await userService.updateAvatar(avatarFile);
			}
			router.push("/profile");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Não foi possível atualizar o perfil."
			);
			setSaving(false);
		}
	}

	if (loading) return <p className={styles.state}>Carregando seu perfil…</p>;
	if (loadError) return <p className={styles.state}>{loadError}</p>;

	const previewName = `${firstName} ${lastName}`.trim() || user?.name || "";
	const avatarToShow = avatarPreview ?? resolveImageUrl(existingAvatarUrl);

	return (
		<form className={styles.container} onSubmit={handleSubmit}>
			<h1 className={styles.pageTitle}>Profile</h1>

			<section className={styles.banner}>
				<span
					className={styles.avatar}
					style={buildAvatarStyle(avatarToShow)}
				>
					{!avatarToShow && (
						<span className={styles.initial}>
							{previewName.charAt(0).toUpperCase()}
						</span>
					)}
				</span>
				<div className={styles.bannerInfo}>
					<p className={styles.bannerName}>{previewName}</p>
					<p className={styles.bannerHandle}>
						{user ? `@${user.username}` : ""}
					</p>
				</div>
			</section>

			<div className={styles.fields}>
				<div className={styles.field}>
					<label className={styles.label} htmlFor="firstName">
						Qual seu primeiro nome?
					</label>
					<input
						id="firstName"
						className={styles.input}
						value={firstName}
						onChange={(event) => setFirstName(event.target.value)}
					/>
				</div>

				<div className={styles.field}>
					<label className={styles.label} htmlFor="lastName">
						E seu último nome?
					</label>
					<input
						id="lastName"
						className={styles.input}
						value={lastName}
						onChange={(event) => setLastName(event.target.value)}
					/>
				</div>

				<div className={styles.field}>
					<label className={styles.label} htmlFor="gender">
						Selecione o seu gênero:
					</label>
					<select
						id="gender"
						className={styles.input}
						value={gender}
						onChange={(event) => setGender(event.target.value)}
					>
						<option value="">Selecione…</option>
						{GENDER_OPTIONS.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>

				<div className={styles.field}>
					<span className={styles.label}>Foto de perfil</span>
					<div className={styles.uploadRow}>
						<span
							className={styles.preview}
							style={buildAvatarStyle(avatarToShow)}
						>
							{!avatarToShow && (
								<span className={styles.previewPlaceholder}>
									{previewName.charAt(0).toUpperCase() || "?"}
								</span>
							)}
						</span>
						<div className={styles.uploadControls}>
							<label htmlFor="avatar" className={styles.fileButton}>
								{avatarFile ? "Trocar imagem" : "Escolher imagem"}
							</label>
							<input
								id="avatar"
								ref={fileInputRef}
								className={styles.fileInput}
								type="file"
								accept="image/jpeg,image/png,image/webp"
								onChange={handleAvatarChange}
							/>
							{avatarFile && (
								<button
									type="button"
									className={styles.clearImage}
									onClick={clearAvatarSelection}
								>
									Remover seleção
								</button>
							)}
							<p className={styles.helper}>
								JPEG, PNG ou WebP · até 5 MB
							</p>
						</div>
					</div>
				</div>

				<div className={styles.field}>
					<label className={styles.label} htmlFor="bio">
						Descrição:
					</label>
					<textarea
						id="bio"
						className={styles.textarea}
						rows={4}
						value={bio}
						onChange={(event) => setBio(event.target.value)}
						placeholder="Conte um pouco sobre você…"
					/>
				</div>
			</div>

			<section className={styles.allergens}>
				<p className={styles.label}>Alergias e intolerâncias</p>
				<p className={styles.helper}>
					Receitas que contêm esses ingredientes não aparecem no seu feed.
				</p>
				{allAllergens.length === 0 ? (
					<p className={styles.helper}>Nenhum alérgeno cadastrado.</p>
				) : (
					<div className={styles.allergenChips}>
						{allAllergens.map((item) => {
							const active = myAllergenIds.has(item.id);
							const busy = allergenBusy.has(item.id);
							return (
								<button
									key={item.id}
									type="button"
									className={`${styles.allergenChip} ${
										active ? styles.allergenChipActive : ""
									}`}
									onClick={() => toggleAllergen(item.id)}
									disabled={busy}
								>
									{item.name}
								</button>
							);
						})}
					</div>
				)}
				{allergenError && <p className={styles.error}>{allergenError}</p>}
			</section>

			{error && <p className={styles.error}>{error}</p>}

			<div className={styles.actions}>
				<button type="submit" className={styles.update} disabled={saving}>
					{saving ? "Atualizando…" : "Atualizar Perfil"}
				</button>
				<button
					type="button"
					className={styles.cancel}
					onClick={() => router.push("/profile")}
					disabled={saving}
				>
					Cancelar
				</button>
			</div>
		</form>
	);
}