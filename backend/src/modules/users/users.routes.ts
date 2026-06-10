import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { UsersController } from "./users.controller";

const router = Router();

const controller = new UsersController();

/**
 * @openapi
 * /users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Atualizar perfil do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Artur Silva
 *               bio:
 *                 type: string
 *                 example: Desenvolvedor apaixonado por produto e UI.
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://cdn.example.com/avatars/artur.png
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                   nullable: true
 *                 bio:
 *                   type: string
 *                   nullable: true
 *             example:
 *               id: cm1q2w3e4r5t6y7u8i9o0p
 *               name: Artur Silva
 *               username: artur_silva
 *               email: artur@example.com
 *               role: USER
 *               avatarUrl: https://cdn.example.com/avatars/artur.png
 *               bio: Desenvolvedor apaixonado por produto e UI.
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.patch(
  "/me",
  authMiddleware,
  controller.updateProfile
);

export default router;