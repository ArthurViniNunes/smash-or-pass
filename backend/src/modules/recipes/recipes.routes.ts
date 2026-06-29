import { Router }
  from "express";

import {
  RecipesController,
} from "./recipes.controller";

import {
  authMiddleware,
} from "../../middlewares/auth.middleware";
import { uploadRecipeImage } from "../../middlewares/upload.middleware";

const router = Router();

const controller =
  new RecipesController();

/**
 * @openapi
 * /recipes:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Listar todas as receitas aprovadas
 *     responses:
 *       200:
 *         description: Lista de receitas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   preparationMethod:
 *                     type: string
 *                   preparationTimeMinutes:
 *                     type: integer
 *                   difficulty:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                     nullable: true
 *                   status:
 *                     type: string
 *                   authorId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   author:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         recipeId:
 *                           type: string
 *                         categoryId:
 *                           type: string
 *                         category:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             status:
 *                               type: string
 *                   dietPreferences:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         recipeId:
 *                           type: string
 *                         dietPreferenceId:
 *                           type: string
 *                         dietPreference:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                   ingredients:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         recipeId:
 *                           type: string
 *                         ingredientId:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         unit:
 *                           type: string
 *                         ingredient:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *             example:
 *               - id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 title: Macarrão ao pesto
 *                 description: Receita simples e rápida de macarrão com pesto.
 *                 preparationMethod: Cozinhe o macarrão e misture ao molho.
 *                 preparationTimeMinutes: 25
 *                 difficulty: EASY
 *                 imageUrl: null
 *                 status: APPROVED
 *                 authorId: cm1q2w3e4r5t6y7u8i9o0p
 *                 createdAt: 2026-06-10T04:22:33.000Z
 *                 updatedAt: 2026-06-10T04:22:33.000Z
 *                 author:
 *                   id: cm1q2w3e4r5t6y7u8i9o0p
 *                   username: arthur_nunes
 *                   avatarUrl: null
 *                 categories:
 *                   - recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                     categoryId: 7b54-4e0b-9b2e-5a7fd0a1d123
 *                     category:
 *                       id: 7b54-4e0b-9b2e-5a7fd0a1d123
 *                       name: Massas
 *                       status: APPROVED
 *                 dietPreferences:
 *                   - recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                     dietPreferenceId: 6b54-4e0b-9b2e-5a7fd0a1d124
 *                     dietPreference:
 *                       id: 6b54-4e0b-9b2e-5a7fd0a1d124
 *                       name: Vegetariana
 *                 ingredients:
 *                   - id: 1b54-4e0b-9b2e-5a7fd0a1d125
 *                     recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                     ingredientId: 5b54-4e0b-9b2e-5a7fd0a1d126
 *                     quantity: 100
 *                     unit: g
 *                     ingredient:
 *                       id: 5b54-4e0b-9b2e-5a7fd0a1d126
 *                       name: Tomate
 */
router.get(
  "/",
  controller.findAll
);

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Buscar receita por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Receita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 preparationMethod:
 *                   type: string
 *                 preparationTimeMinutes:
 *                   type: integer
 *                 difficulty:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: string
 *                 authorId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 author:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       recipeId:
 *                         type: string
 *                       categoryId:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           status:
 *                             type: string
 *                 dietPreferences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       recipeId:
 *                         type: string
 *                       dietPreferenceId:
 *                         type: string
 *                       dietPreference:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       recipeId:
 *                         type: string
 *                       ingredientId:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       unit:
 *                         type: string
 *                       ingredient:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       recipeId:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *             example:
 *               id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *               title: Macarrão ao pesto
 *               description: Receita simples e rápida de macarrão com pesto.
 *               preparationMethod: Cozinhe o macarrão e misture ao molho.
 *               preparationTimeMinutes: 25
 *               difficulty: EASY
 *               imageUrl: null
 *               status: APPROVED
 *               authorId: cm1q2w3e4r5t6y7u8i9o0p
 *               createdAt: 2026-06-10T04:22:33.000Z
 *               updatedAt: 2026-06-10T04:22:33.000Z
 *               author:
 *                 id: cm1q2w3e4r5t6y7u8i9o0p
 *                 username: arthur_nunes
 *                 avatarUrl: null
 *               categories:
 *                 - recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   categoryId: 7b54-4e0b-9b2e-5a7fd0a1d123
 *                   category:
 *                     id: 7b54-4e0b-9b2e-5a7fd0a1d123
 *                     name: Massas
 *                     status: APPROVED
 *               dietPreferences:
 *                 - recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   dietPreferenceId: 6b54-4e0b-9b2e-5a7fd0a1d124
 *                   dietPreference:
 *                     id: 6b54-4e0b-9b2e-5a7fd0a1d124
 *                     name: Vegetariana
 *               ingredients:
 *                 - id: 1b54-4e0b-9b2e-5a7fd0a1d125
 *                   recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   ingredientId: 5b54-4e0b-9b2e-5a7fd0a1d126
 *                   quantity: 100
 *                   unit: g
 *                   ingredient:
 *                     id: 5b54-4e0b-9b2e-5a7fd0a1d126
 *                     name: Tomate
 *               comments:
 *                 - id: 2b54-4e0b-9b2e-5a7fd0a1d127
 *                   content: Ficou excelente.
 *                   recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   userId: cm1q2w3e4r5t6y7u8i9o0p
 *                   createdAt: 2026-06-10T04:22:33.000Z
 *                   updatedAt: 2026-06-10T04:22:33.000Z
 *                   user:
 *                     id: cm1q2w3e4r5t6y7u8i9o0p
 *                     username: arthur_nunes
 *       404:
 *         description: Receita não encontrada
 */
router.get(
  "/:id",
  controller.findById
);

/**
 * @openapi
 * /recipes:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Criar receita
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - preparationMethod
 *               - preparationTimeMinutes
 *               - difficulty
 *               - categoryIds
 *               - ingredients
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 150
 *                 example: Macarrão ao pesto
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Receita simples e rápida de macarrão com pesto.
 *               preparationMethod:
 *                 type: string
 *                 minLength: 10
 *                 example: Cozinhe o macarrão e misture ao molho.
 *               preparationTimeMinutes:
 *                 type: integer
 *                 minimum: 1
 *                 example: 25
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - EASY
 *                   - MEDIUM
 *                   - HARD
 *                 example: EASY
 *               image:
 *                type: string
 *                format: binary
 *                description: Imagem da receita
 *               categoryIds:
 *                type: string
 *                description: JSON contendo um array de IDs das categorias.
 *                example: '["7b54-4e0b-9b2e-5a7fd0a1d123"]'
 *               dietPreferenceIds:
 *                type: string
 *                description: JSON contendo um array de IDs das preferências alimentares.
 *                example: '["6b54-4e0b-9b2e-5a7fd0a1d124"]'
 *               ingredients:
 *                type: string
 *                description: JSON contendo um array de ingredientes.
 *                example: '[{"ingredientId":"5b54-4e0b-9b2e-5a7fd0a1d126","quantity":100,"unit":"g"}]'
 *             example:
 *               title: Macarrão ao pesto
 *               description: Receita simples e rápida.
 *               preparationMethod: Cozinhe o macarrão.
 *               preparationTimeMinutes: 25
 *               difficulty: EASY
 *               categoryIds: '["id-category"]'
 *               dietPreferenceIds: '["id-diet"]'
 *               ingredients: '[{"ingredientId":"id","quantity":100,"unit":"g"}]'
 *     responses:
 *       201:
 *         description: Receita criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 preparationMethod:
 *                   type: string
 *                 preparationTimeMinutes:
 *                   type: integer
 *                 difficulty:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: string
 *                 authorId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 categories:
 *                   type: array
 *                 dietPreferences:
 *                   type: array
 *                 ingredients:
 *                   type: array
 *             example:
 *               id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *               title: Macarrão ao pesto
 *               description: Receita simples e rápida de macarrão com pesto.
 *               preparationMethod: Cozinhe o macarrão e misture ao molho.
 *               preparationTimeMinutes: 25
 *               difficulty: EASY
 *               imageUrl: null
 *               status: PENDING
 *               authorId: cm1q2w3e4r5t6y7u8i9o0p
 *               createdAt: 2026-06-10T04:22:33.000Z
 *               updatedAt: 2026-06-10T04:22:33.000Z
 *               categories: []
 *               dietPreferences: []
 *               ingredients: []
 *       400:
 *         description: Categorias ou ingredientes inválidos, ou payload inválido
 *       401:
 *         description: Token ausente ou inválido
 */
router.post(
  "/",
  authMiddleware,
  uploadRecipeImage,
  controller.create
);

/**
 * @openapi
 * /recipes/{id}:
 *   patch:
 *     tags:
 *       - Recipes
 *     summary: Atualizar receita
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - preparationMethod
 *               - preparationTimeMinutes
 *               - difficulty
 *               - categoryIds
 *               - ingredients
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 150
 *                 example: Macarrão ao pesto
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Receita simples e rápida de macarrão com pesto.
 *               preparationMethod:
 *                 type: string
 *                 minLength: 10
 *                 example: Cozinhe o macarrão e misture ao molho.
 *               preparationTimeMinutes:
 *                 type: integer
 *                 minimum: 1
 *                 example: 25
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - EASY
 *                   - MEDIUM
 *                   - HARD
 *                 example: EASY
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem da receita. Opcional.
 *               categoryIds:
 *                 type: string
 *                 description: JSON contendo um array de IDs das categorias.
 *                 example: '["7b54-4e0b-9b2e-5a7fd0a1d123"]'
 *               dietPreferenceIds:
 *                 type: string
 *                 description: JSON contendo um array de IDs das preferências alimentares.
 *                 example: '["6b54-4e0b-9b2e-5a7fd0a1d124"]'
 *               ingredients:
 *                 type: string
 *                 description: JSON contendo um array de ingredientes.
 *                 example: '[{"ingredientId":"5b54-4e0b-9b2e-5a7fd0a1d126","quantity":100,"unit":"g"}]'
 *           example:
 *             title: Macarrão ao pesto
 *             description: Receita simples e rápida.
 *             preparationMethod: Cozinhe o macarrão.
 *             preparationTimeMinutes: 25
 *             difficulty: EASY
 *             categoryIds: '["7b54-4e0b-9b2e-5a7fd0a1d123"]'
 *             dietPreferenceIds: '["6b54-4e0b-9b2e-5a7fd0a1d124"]'
 *             ingredients: '[{"ingredientId":"5b54-4e0b-9b2e-5a7fd0a1d126","quantity":100,"unit":"g"}]'
 *     responses:
 *       200:
 *         description: Receita atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 preparationMethod:
 *                   type: string
 *                 preparationTimeMinutes:
 *                   type: integer
 *                 difficulty:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: string
 *                 authorId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 categories:
 *                   type: array
 *                 dietPreferences:
 *                   type: array
 *                 ingredients:
 *                   type: array
 *             example:
 *               id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *               title: Macarrão ao pesto
 *               description: Receita simples e rápida de macarrão com pesto.
 *               preparationMethod: Cozinhe o macarrão e misture ao molho.
 *               preparationTimeMinutes: 25
 *               difficulty: EASY
 *               imageUrl: null
 *               status: PENDING
 *               authorId: cm1q2w3e4r5t6y7u8i9o0p
 *               createdAt: 2026-06-10T04:22:33.000Z
 *               updatedAt: 2026-06-10T04:22:33.000Z
 *               categories: []
 *               dietPreferences: []
 *               ingredients: []
 *       400:
 *         description: Categorias ou ingredientes inválidos, ou payload inválido
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Sem permissão para editar esta receita
 *       404:
 *         description: Receita não encontrada
 */
router.patch(
  "/:id",
  authMiddleware,
  uploadRecipeImage,
  controller.update
);

/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Deletar receita
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
 *         description: Receita deletada com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Sem permissão para deletar esta receita
 *       404:
 *         description: Receita não encontrada
 */
router.delete(
  "/:id",
  authMiddleware,
  controller.delete
);

export default router;