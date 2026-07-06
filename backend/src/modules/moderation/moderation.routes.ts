import { Router } from "express";
import { ModerationController } from "./moderation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { RoleName } from "../../generated/prisma";

const router = Router();
const controller = new ModerationController();

router.use(authMiddleware);
router.use(roleMiddleware(RoleName.ADMIN));

/**
 * @openapi
 * /moderation/pending:
 *   get:
 *     tags:
 *       - Moderation
 *     summary: Listar itens pendentes de moderação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Itens pendentes agrupados por tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/pending", controller.listPending);

/**
 * @openapi
 * /moderation/rejected:
 *   get:
 *     tags:
 *       - Moderation
 *     summary: Listar itens rejeitados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de itens rejeitados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *        
 */
router.get("/rejected", controller.listRejected);

/**
 * @openapi
 * /moderation/recipes/{id}:
 *   patch:
 *     tags:
 *       - Moderation
 *     summary: Moderar receita
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - APPROVED
 *                   - REJECTED
 *     responses:
 *       200:
 *         description: Receita moderada
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Receita não encontrada
 */
router.patch("/recipes/:id", controller.moderateRecipe);

/**
 * @openapi
 * /moderation/categories/{id}:
 *   patch:
 *     tags:
 *       - Moderation
 *     summary: Moderar categoria
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - APPROVED
 *                   - REJECTED
 *     responses:
 *       200:
 *         description: Categoria moderada
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Categoria não encontrada
 */
router.patch("/categories/:id", controller.moderateCategory);

/**
 * @openapi
 * /moderation/ingredients/{id}:
 *   patch:
 *     tags:
 *       - Moderation
 *     summary: Moderar ingrediente
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - APPROVED
 *                   - REJECTED
 *     responses:
 *       200:
 *         description: Ingrediente moderado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Ingrediente não encontrado
 */
router.patch("/ingredients/:id", controller.moderateIngredient);

export default router;