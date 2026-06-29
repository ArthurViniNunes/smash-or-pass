export function normalizeMultipartBody<
  T extends Record<string, unknown>,
>(body: T): T {
  const normalized = { ...body };

  for (const [key, value] of Object.entries(normalized)) {
    if (typeof value !== "string") {
      continue;
    }

    const trimmed = value.trim();

    const looksLikeJson =
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"));

    if (!looksLikeJson) {
      continue;
    }

    try {
      normalized[key as keyof T] = JSON.parse(trimmed);
    } catch {
      // Mantém o valor original caso não seja um JSON válido
    }
  }

  return normalized;
}