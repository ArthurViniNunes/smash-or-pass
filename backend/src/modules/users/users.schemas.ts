import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.url().optional(),
});

export type UpdateProfileDto =
  z.infer<typeof updateProfileSchema>;