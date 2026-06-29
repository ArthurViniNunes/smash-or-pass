import { Router } from "express";

import { authMiddleware }
  from "../../middlewares/auth.middleware";

import { CategoriesController }
  from "./categories.controller";

const router = Router();

const controller =
  new CategoriesController();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Listar todas as categorias aprovadas
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdById:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *             example:
 *               - id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 name: Massas
 *                 status: APPROVED
 *                 createdById: cm1q2w3e4r5t6y7u8i9o0p
 *                 createdAt: 2026-06-10T04:22:33.000Z
 *                 createdBy:
 *                   id: cm1q2w3e4r5t6y7u8i9o0p
 *                   username: arthur_nunes
 */
router.get(
  "/",
  controller.findAll
);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Buscar categoria por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdById:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 createdBy:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *             example:
 *               id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *               name: Massas
 *               status: APPROVED
 *               createdById: cm1q2w3e4r5t6y7u8i9o0p
 *               createdAt: 2026-06-10T04:22:33.000Z
 *               createdBy:
 *                 id: cm1q2w3e4r5t6y7u8i9o0p
 *                 username: arthur_nunes
 *       404:
 *         description: Categoria não encontrada
 */
router.get(
  "/:id",
  controller.findById
);

/**
 * @openapi
 * /categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Criar categoria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Massas
 *     responses:
 *       201:
 *         description: Categoria criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdById:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *               name: Massas
 *               status: PENDING
 *               createdById: cm1q2w3e4r5t6y7u8i9o0p
 *               createdAt: 2026-06-10T04:22:33.000Z
 *       401:
 *         description: Token ausente ou inválido
 *       409:
 *         description: Categoria já existe
 */
router.post(
  "/",
  authMiddleware,
  controller.create
);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     tags:
 *       - Categories
 *     summary: Atualizar categoria
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Massas e Cereais
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdById:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *               name: Massas e Cereais
 *               status: APPROVED
 *               createdById: cm1q2w3e4r5t6y7u8i9o0p
 *               createdAt: 2026-06-10T04:22:33.000Z
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Categoria não encontrada
 */
router.patch(
  "/:id",
  authMiddleware,
  controller.update
);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Remover categoria
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Categoria removida com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Categoria não encontrada
 */
router.delete(
  "/:id",
  authMiddleware,
  controller.delete
);

export default router;