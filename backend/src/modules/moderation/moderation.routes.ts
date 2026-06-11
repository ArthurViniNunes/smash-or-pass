import { Router } from "express";
import { ModerationController } from "./moderation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { RoleName } from "../../generated/prisma";

const router = Router();
const controller = new ModerationController();

router.use(authMiddleware);
router.use(roleMiddleware(RoleName.ADMIN));

router.get("/pending", controller.listPending);

router.patch("/recipes/:id", controller.moderateRecipe);
router.patch("/categories/:id", controller.moderateCategory);
router.patch("/ingredients/:id", controller.moderateIngredient);

export default router;