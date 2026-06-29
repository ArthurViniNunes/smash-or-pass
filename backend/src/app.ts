import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware";

import routes from "./routes";
import swaggerRouter from "./swagger";
import { ensureUploadDirectories } from "./utils/ensure-upload-directories";
import { UPLOADS_DIRECTORY } from "./config/upload";

ensureUploadDirectories();
const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.use("/uploads", express.static(UPLOADS_DIRECTORY));

app.use("/docs", swaggerRouter);


app.use(routes);

app.use(errorMiddleware);

export default app;