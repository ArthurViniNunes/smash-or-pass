import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registrar usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arthur Nunes
 *               username:
 *                 type: string
 *                 example: arthur_nunes
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arthur@example.com
 *               password:
 *                 type: string
 *                 example: Senha@1234
 *     responses:
 *       201:
 *         description: Usuário criado
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
 *             example:
 *               id: cm1q2w3e4r5t6y7u8i9o0p
 *               name: Arthur Nunes
 *               username: arthur_nunes
 *               email: arthur@example.com
 *               role: USER
 *       409:
 *         description: Email ou username já em uso
 */
router.post("/register", controller.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Autenticar usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arthur@example.com
 *               password:
 *                 type: string
 *                 example: Senha@1234
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                     bio:
 *                       type: string
 *                       nullable: true
 *             example:
 *               accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 id: cm1q2w3e4r5t6y7u8i9o0p
 *                 name: Arthur Nunes
 *                 username: arthur_nunes
 *                 email: arthur@example.com
 *                 role: USER
 *                 avatarUrl: /uploads/avatars/seed/admin-avatar.webp
 *                 bio: Desenvolvedor Full Stack do Smash or Pass.
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", controller.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Obter dados do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado
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
 *               name: Arthur Nunes
 *               username: arthur_nunes
 *               email: arthur@example.com
 *               role: USER
 *               avatarUrl: null
 *               bio: null
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/me", authMiddleware, controller.me);

export default router;