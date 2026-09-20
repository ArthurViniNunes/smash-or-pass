import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware";
import { env } from "./config/env";
import routes from "./routes";
import swaggerRouter from "./swagger";
import { ensureUploadDirectories } from "./utils/ensure-upload-directories";
import { UPLOADS_DIRECTORY } from "./config/upload";
import { auditLogMiddleware } from "./middlewares/audit-log.middleware";

ensureUploadDirectories();
const app = express();

// Por padrão o Helmet envia "Cross-Origin-Resource-Policy: same-origin",
// o que faz o browser BLOQUEAR as imagens de /uploads quando carregadas
// pelo frontend (outra origem, ex.: localhost:5173 -> localhost:3000).
// Liberamos apenas essa política para permitir o uso das imagens cross-origin.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const allowedOrigins = env.CORS_ORIGINS
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
  })
);

app.use(express.json());

app.use(morgan("dev"));

app.use("/uploads", express.static(UPLOADS_DIRECTORY));

app.use("/docs", swaggerRouter);

app.use(auditLogMiddleware);

app.use(routes);

app.use(errorMiddleware);

export default app;