import fs from "node:fs";
import path from "node:path";

import { LocalStorageProvider } from "../storage/local-storage-provider";
import { UploadFolder } from "../storage/types";

async function run() {
  const storage = new LocalStorageProvider();

  // 1. carregar imagem real (para isso adicione uma imagem chamada "image.png" na raiz do projeto)
  const filePath = path.resolve("image.png");

  const buffer = fs.readFileSync(filePath);

  // 2. simular UploadFile
  const file = {
    buffer,
    originalName: "test-image.jpg",
    mimeType: "image/jpeg",
  };

  console.log("📤 Salvando imagem...");

  // 3. salvar
  const saved = await storage.save(file, UploadFolder.RECIPES);

  console.log("✅ Salvo com sucesso:");
  console.log(saved);

  // 4. validar arquivo físico
  const fullPath = path.join(
    process.cwd(),
    saved.url.replace("/uploads/", "uploads/"),
  );

  console.log("📂 Caminho físico:", fullPath);

  console.log("🧪 Verificando existência...");
  console.log(fs.existsSync(fullPath) ? "OK" : "FAIL");

  // 5. testar delete
  console.log("🗑️ Removendo arquivo...");

  await storage.delete(saved.url);

  console.log(
    "🧪 Após delete:",
    fs.existsSync(fullPath) ? "AINDA EXISTE (FAIL)" : "REMOVIDO (OK)",
  );
}

run().catch((err) => {
  console.error("❌ Erro no teste:", err);
});