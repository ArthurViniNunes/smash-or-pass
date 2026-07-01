"use client";

import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type SyntheticEvent,
} from "react";
import { useRouter } from "next/navigation";
import { recipeService, resolveImageUrl } from "@/services/recipe.service";
import { catalogService } from "@/services/catalog.service";
import type { CatalogItem, Difficulty, RecipePayload } from "@/types/recipe";
import styles from "./RecipeForm.module.css";

type RecipeFormProps = {
	mode: "create" | "edit";
	recipeId?: string;
};

type IngredientRow = {
	ingredientId: string;
	quantity: string;
	unit: string;
};

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
	{ value: "EASY", label: "Fácil" },
	{ value: "MEDIUM", label: "Médio" },
	{ value: "HARD", label: "Difícil" },
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB (igual ao backend)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function emptyIngredient(): IngredientRow {
	return { ingredientId: "", quantity: "", unit: "" };
}

export default function RecipeForm({ mode, recipeId }: RecipeFormProps) {
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [preparationMethod, setPreparationMethod] = useState("");
	const [preparationTime, setPreparationTime] = useState("");
	const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
	const [categoryIds, setCategoryIds] = useState<string[]>([]);
	const [ingredients, setIngredients] = useState<IngredientRow[]>([
		emptyIngredient(),
	]);

	// Imagem
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [existingImageUrl, setExistingImageUrl] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const objectUrlRef = useRef<string | null>(null);

	const [categories, setCategories] = useState<CatalogItem[]>([]);
	const [ingredientOptions, setIngredientOptions] = useState<CatalogItem[]>([]);

	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		async function load() {
			setLoading(true);
			setLoadError(null);
			try {
				const [cats, ings] = await Promise.all([
					catalogService.getCategories(),
					catalogService.getIngredients(),
				]);
				if (!active) return;
				setCategories(cats);
				setIngredientOptions(ings);

				if (mode === "edit" && recipeId) {
					const recipe = await recipeService.getRawById(recipeId);
					if (!active) return;
					setTitle(recipe.title);
					setDescription(recipe.description ?? "");
					setPreparationMethod(recipe.preparationMethod ?? "");
					setPreparationTime(
						recipe.preparationTimeMinutes
							? String(recipe.preparationTimeMinutes)
							: ""
					);
					setDifficulty((recipe.difficulty as Difficulty) ?? "EASY");
					const resolved = resolveImageUrl(recipe.imageUrl) ?? "";
					setExistingImageUrl(resolved);
					setPreviewUrl(resolved);
					setCategoryIds(
						(recipe.categories ?? []).map((entry) => entry.category.id)
					);
					const rows = (recipe.ingredients ?? []).map((entry) => ({
						ingredientId: entry.ingredientId,
						quantity: String(entry.quantity),
						unit: entry.unit,
					}));
					setIngredients(rows.length > 0 ? rows : [emptyIngredient()]);
				}
			} catch (err) {
				if (active) {
					setLoadError(
						err instanceof Error
							? err.message
							: "Não foi possível carregar os dados do formulário."
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
	}, [mode, recipeId]);

	// Libera o object URL ao desmontar
	useEffect(() => {
		return () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0] ?? null;
		setError(null);

		if (file) {
			if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
				setError("Formato inválido. Use uma imagem JPEG, PNG ou WebP.");
				event.target.value = "";
				return;
			}
			if (file.size > MAX_IMAGE_SIZE) {
				setError("A imagem deve ter no máximo 5 MB.");
				event.target.value = "";
				return;
			}
		}

		// Revoga o preview anterior, se for um object URL
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}

		setImageFile(file);

		if (file) {
			const url = URL.createObjectURL(file);
			objectUrlRef.current = url;
			setPreviewUrl(url);
		} else {
			setPreviewUrl(existingImageUrl);
		}
	}

	function handleClearImage() {
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
		setImageFile(null);
		setPreviewUrl(existingImageUrl);
	}

	function toggleCategory(id: string) {
		setCategoryIds((current) =>
			current.includes(id)
				? current.filter((value) => value !== id)
				: [...current, id]
		);
	}

	function updateIngredient(index: number, patch: Partial<IngredientRow>) {
		setIngredients((current) =>
			current.map((row, i) => (i === index ? { ...row, ...patch } : row))
		);
	}

	function addIngredient() {
		setIngredients((current) => [...current, emptyIngredient()]);
	}

	function removeIngredient(index: number) {
		setIngredients((current) =>
			current.length === 1 ? current : current.filter((_, i) => i !== index)
		);
	}

	function validate(): string | null {
		if (title.trim().length < 3)
			return "O nome da receita deve ter ao menos 3 caracteres.";
		if (description.trim().length < 10)
			return "A descrição deve ter ao menos 10 caracteres.";
		if (preparationMethod.trim().length < 10)
			return "O modo de preparo deve ter ao menos 10 caracteres.";
		const time = Number(preparationTime);
		if (!Number.isInteger(time) || time <= 0)
			return "Informe um tempo de preparo válido (em minutos inteiros).";
		if (categoryIds.length < 1) return "Selecione ao menos uma categoria.";
		const filled = ingredients.filter((row) => row.ingredientId);
		if (filled.length < 1) return "Adicione ao menos um ingrediente.";
		for (const row of filled) {
			if (!(Number(row.quantity) > 0))
				return "Cada ingrediente precisa de uma quantidade maior que zero.";
			if (row.unit.trim().length < 1)
				return "Cada ingrediente precisa de uma unidade.";
		}
		return null;
	}

	async function handleSubmit(event: SyntheticEvent) {
		event.preventDefault();
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}

		setSaving(true);
		setError(null);

		const payload: RecipePayload = {
			title: title.trim(),
			description: description.trim(),
			preparationMethod: preparationMethod.trim(),
			preparationTimeMinutes: Number(preparationTime),
			difficulty,
			categoryIds,
			dietPreferenceIds: [],
			ingredients: ingredients
				.filter((row) => row.ingredientId)
				.map((row) => ({
					ingredientId: row.ingredientId,
					quantity: Number(row.quantity),
					unit: row.unit.trim(),
				})),
			imageFile,
		};

		try {
			if (mode === "edit" && recipeId) {
				await recipeService.update(recipeId, payload);
			} else {
				await recipeService.create(payload);
			}
			router.push("/recipes/mine");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Não foi possível salvar a receita."
			);
			setSaving(false);
		}
	}

	const heading = mode === "edit" ? "Editar receita" : "Criar receita";

	if (loading) return <p className={styles.state}>Carregando…</p>;
	if (loadError) return <p className={styles.state}>{loadError}</p>;

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h1 className={styles.heading}>{heading}</h1>

			<section className={styles.uploadBox}>
				<span className={styles.label}>Imagem da receita</span>
				<div className={styles.uploadRow}>
					{previewUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={previewUrl}
							alt="Pré-visualização da receita"
							className={styles.preview}
						/>
					) : (
						<div className={styles.previewPlaceholder}>Sem imagem</div>
					)}

					<div className={styles.uploadControls}>
						<label className={styles.fileButton}>
							{previewUrl ? "Trocar imagem" : "Escolher imagem"}
							<input
								type="file"
								accept="image/jpeg,image/png,image/webp"
								className={styles.fileInput}
								onChange={handleFileChange}
							/>
						</label>

						{imageFile && (
							<button
								type="button"
								className={styles.clearImage}
								onClick={handleClearImage}
							>
								Remover seleção
							</button>
						)}

						<p className={styles.hint}>
							JPEG, PNG ou WebP · até 5 MB. A imagem é otimizada
							automaticamente.
						</p>
					</div>
				</div>
			</section>

			<div className={styles.columns}>
				<section className={styles.panel}>
					<h2 className={styles.panelTitle}>Informações</h2>

					<label className={styles.label} htmlFor="title">
						Nome da receita
					</label>
					<input
						id="title"
						className={styles.input}
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Comida havaiana suprema"
					/>

					<label className={styles.label} htmlFor="description">
						Descrição
					</label>
					<textarea
						id="description"
						className={styles.textarea}
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="A melhor comida do mundo…"
						rows={3}
					/>

					<label className={styles.label} htmlFor="time">
						Tempo de preparo (minutos)
					</label>
					<input
						id="time"
						className={styles.input}
						type="number"
						min={1}
						value={preparationTime}
						onChange={(event) => setPreparationTime(event.target.value)}
						placeholder="30"
					/>

					<label className={styles.label} htmlFor="difficulty">
						Dificuldade
					</label>
					<select
						id="difficulty"
						className={styles.input}
						value={difficulty}
						onChange={(event) => setDifficulty(event.target.value as Difficulty)}
					>
						{DIFFICULTY_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					<span className={styles.label}>Categorias</span>
					<div className={styles.chips}>
						{categories.length === 0 ? (
							<p className={styles.hint}>Nenhuma categoria disponível.</p>
						) : (
							categories.map((category) => (
								<button
									type="button"
									key={category.id}
									className={
										categoryIds.includes(category.id)
											? styles.chipActive
											: styles.chip
									}
									onClick={() => toggleCategory(category.id)}
								>
									{category.name}
								</button>
							))
						)}
					</div>
				</section>

				<section className={styles.panel}>
					<h2 className={styles.panelTitle}>Modo de Preparo</h2>
					<textarea
						className={styles.textareaTall}
						value={preparationMethod}
						onChange={(event) => setPreparationMethod(event.target.value)}
						placeholder={"Refogue o alho\nPique a pimentinha\nMisture e deixe descansar"}
						rows={12}
					/>
				</section>
			</div>

			<section className={styles.panel}>
				<div className={styles.ingHeader}>
					<h2 className={styles.panelTitle}>Lista de ingredientes</h2>
					<button
						type="button"
						className={styles.addIngredient}
						onClick={addIngredient}
					>
						Novo ingrediente +
					</button>
				</div>

				<div className={styles.ingredients}>
					{ingredients.map((row, index) => (
						<div className={styles.ingredientRow} key={index}>
							<select
								className={styles.ingredientSelect}
								value={row.ingredientId}
								onChange={(event) =>
									updateIngredient(index, { ingredientId: event.target.value })
								}
							>
								<option value="">Ingrediente…</option>
								{ingredientOptions.map((ingredient) => (
									<option key={ingredient.id} value={ingredient.id}>
										{ingredient.name}
									</option>
								))}
							</select>
							<input
								className={styles.ingredientQty}
								type="number"
								min={0}
								step="any"
								placeholder="Qtd"
								value={row.quantity}
								onChange={(event) =>
									updateIngredient(index, { quantity: event.target.value })
								}
							/>
							<input
								className={styles.ingredientUnit}
								placeholder="Unidade (g, ml…)"
								value={row.unit}
								onChange={(event) =>
									updateIngredient(index, { unit: event.target.value })
								}
							/>
							<button
								type="button"
								className={styles.removeIngredient}
								onClick={() => removeIngredient(index)}
								aria-label="Remover ingrediente"
								disabled={ingredients.length === 1}
							>
								×
							</button>
						</div>
					))}
				</div>
			</section>

			{error && <p className={styles.error}>{error}</p>}

			<div className={styles.actions}>
				<button
					type="button"
					className={styles.cancel}
					onClick={() => router.push("/recipes/mine")}
					disabled={saving}
				>
					Cancelar
				</button>
				<button type="submit" className={styles.submit} disabled={saving}>
					{saving
						? "Salvando…"
						: mode === "edit"
							? "Salvar alterações"
							: "Publicar receita"}
				</button>
			</div>
		</form>
	);
}