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
 *                 example: Artur Silva
 *               username:
 *                 type: string
 *                 example: artur_silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: artur@example.com
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
 *               name: Artur Silva
 *               username: artur_silva
 *               email: artur@example.com
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
 *                 example: artur@example.com
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
 *                     role:
 *                       type: string
 *             example:
 *               accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 id: cm1q2w3e4r5t6y7u8i9o0p
 *                 name: Artur Silva
 *                 username: artur_silva
 *                 role: USER
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
 *       501:
 *         description: Não implementado
 */
router.get("/me", authMiddleware,  controller.me);

export default router;