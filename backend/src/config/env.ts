import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),

  DATABASE_URL: z.string(),

  JWT_SECRET: z.string().min(10),

  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  STORAGE_PROVIDER: z
    .enum(["local", "cloudinary", "s3"])
    .default("local"),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  AWS_REGION: z.string().default("us-east-1"),
  AWS_S3_BUCKET: z.string().optional(),
});

export const env = envSchema.parse(process.env);