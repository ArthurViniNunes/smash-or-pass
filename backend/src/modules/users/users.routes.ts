import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { RoleName } from "../../generated/prisma";

import { UsersController } from "./users.controller";
import { uploadAvatar } from "../../middlewares/upload.middleware";

const router = Router();

const controller = new UsersController();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar todos os usuários (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários ordenada pelos mais recentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [USER, ADMIN]
 *                   avatarUrl:
 *                     type: string
 *                     nullable: true
 *                   bio:
 *                     type: string
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - id: cm1q2w3e4r5t6y7u8i9o0p
 *                 name: Arthur Nunes
 *                 username: arthur_nunes
 *                 email: arthur@example.com
 *                 role: USER
 *                 avatarUrl: /uploads/avatars/8f73c4b8.webp
 *                 bio: Desenvolvedor Full Stack apaixonado pelo produto.
 *                 createdAt: 2026-07-04T12:34:56.000Z
 *                 updatedAt: 2026-07-04T12:34:56.000Z
 *               
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(RoleName.ADMIN),
  controller.listUsers
);

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
 *                 minLength: 3
 *                 example: Arthur Nunes
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 example: Desenvolvedor Full Stack apaixonado pelo produto.
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 example: /uploads/avatars/seed/admin-avatar.webp
 *     responses:
 *       200:
 *        description: Perfil atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              type: object
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
 *              example:
 *                id: cm1q2w3e4r5t6y7u8i9o0p
 *                name: Arthur Nunes
 *                username: arthur_nunes
 *                email: arthur@example.com
 *                role: USER
 *                avatarUrl: /uploads/avatars/8f73c4b8.webp
 *                bio: Desenvolvedor Full Stack apaixonado pelo produto.
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

/**
 * @openapi
 * /users/me/allergens:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar alergênicos do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vínculos do usuário com alergênicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   allergenId:
 *                     type: string
 *                   allergen:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *             example:
 *               - userId: cm1q2w3e4r5t6y7u8i9o0p
 *                 allergenId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 allergen:
 *                   id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   name: Amendoim
 *       401:
 *         description: Token ausente ou inválido
 */
router.get(
  "/me/allergens",
  authMiddleware,
  controller.getAllergens
);

/**
 * @openapi
 * /users/me/allergens:
 *   put:
 *     tags:
 *       - Users
 *     summary: Atualizar alergênicos do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - allergenIds
 *             properties:
 *               allergenIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *             example:
 *               allergenIds:
 *                 - 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 - 9a2f4c1d-63f0-4d1a-8d66-4a8f7e2b4567
 *     responses:
 *       200:
 *         description: Alergênicos atualizados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   allergenId:
 *                     type: string
 *                   allergen:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *             example:
 *               - userId: cm1q2w3e4r5t6y7u8i9o0p
 *                 allergenId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 allergen:
 *                   id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   name: Amendoim
 *       401:
 *         description: Token ausente ou inválido
 */
router.put(
  "/me/allergens",
  authMiddleware,
  controller.updateAllergens
);

/**
 * @openapi
 * /users/me/diet-preferences:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar preferências alimentares do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vínculos do usuário com preferências alimentares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   dietPreferenceId:
 *                     type: string
 *                   dietPreference:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *             example:
 *               - userId: cm1q2w3e4r5t6y7u8i9o0p
 *                 dietPreferenceId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 dietPreference:
 *                   id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   name: Vegana
 *       401:
 *         description: Token ausente ou inválido
 */
router.get(
  "/me/diet-preferences",
  authMiddleware,
  controller.getDietPreferences
);

/**
 * @openapi
 * /users/me/diet-preferences:
 *   put:
 *     tags:
 *       - Users
 *     summary: Atualizar preferências alimentares do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dietPreferenceIds
 *             properties:
 *               dietPreferenceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *             example:
 *               dietPreferenceIds:
 *                 - 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 - 9a2f4c1d-63f0-4d1a-8d66-4a8f7e2b4567
 *     responses:
 *       200:
 *         description: Preferências alimentares atualizadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   dietPreferenceId:
 *                     type: string
 *                   dietPreference:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *             example:
 *               - userId: cm1q2w3e4r5t6y7u8i9o0p
 *                 dietPreferenceId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                 dietPreference:
 *                   id: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   name: Vegana
 *       401:
 *         description: Token ausente ou inválido
 */
router.put(
  "/me/diet-preferences",
  authMiddleware,
  controller.updateDietPreferences
);

/**
 * @openapi
 * /users/me/smashs:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obter receitas smashadas pelo usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de receitas smashadas
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
 *                   description:
 *                     type: string
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
*                       avatarUrl:
*                         type: string
 */
router.get(
  '/me/smashs',
  authMiddleware,
  controller.getSmashs
);

/**
 * @openapi
 * /users/me/recipes:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar as receitas do usuário autenticado (todos os status)
 *     description: >-
 *       Retorna as receitas criadas pelo próprio usuário logado, incluindo as
 *       PENDING e REJECTED, para que ele acompanhe o status de moderação.
 *       O escopo por autor é aplicado no servidor.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista das receitas do usuário, das mais recentes para as mais antigas
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
 *               ingredients:
 *                 - id: 1b54-4e0b-9b2e-5a7fd0a1d125
 *                   recipeId: 8d8e9f2b-7b54-4e0b-9b2e-5a7fd0a1d123
 *                   ingredientId: 5b54-4e0b-9b2e-5a7fd0a1d126
 *                   quantity: 100
 *                   unit: g
 *                   ingredient:
 *                     id: 5b54-4e0b-9b2e-5a7fd0a1d126
 *                     name: Tomate
 *       401:
 *         description: Token ausente ou inválido
 */
router.get(
  "/me/recipes",
  authMiddleware,
  controller.getMyRecipes
);

/**
 * @openapi
 * /users/me/recipes/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Detalhe de uma receita do próprio usuário (qualquer status)
 *     description: >-
 *       Retorna uma receita específica criada pelo próprio usuário logado,
 *       independentemente do status (PENDING/APPROVED/REJECTED). Usado para
 *       editar receitas ainda não aprovadas — a rota pública /recipes/{id} só
 *       expõe receitas aprovadas.
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
 *       200:
 *         description: Receita do usuário
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

 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Receita não encontrada ou não pertence ao usuário
 */
router.get(
  "/me/recipes/:id",
  authMiddleware,
  controller.getMyRecipeById
);

/**
 * @openapi
 * /users/me/avatar:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Atualizar avatar do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem (JPEG, PNG ou WebP) que será utilizado como novo avatar do usuário.
 *     responses:
 *       200:
 *         description: Avatar atualizado com sucesso
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
 *       400:
 *         description: Arquivo inválido ou não enviado
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch(
    "/me/avatar",
    authMiddleware,
    uploadAvatar,
    controller.updateAvatar,
);

export default router;