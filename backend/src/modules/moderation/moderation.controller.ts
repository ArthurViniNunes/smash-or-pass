import { Request, Response, NextFunction } from "express";
import { ModerationService } from "./moderation.service";
import { moderationActionSchema, moderationIdParamSchema } from "./moderation.schemas";

export class ModerationController {
  private service = new ModerationService();

  listPending = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.listPending();
      return res.json(result);
    } catch (err) {
      next(err);
    }
  };

  moderateRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = moderationIdParamSchema.parse(req.params);
      const { status } = moderationActionSchema.parse(req.body);

      const result = await this.service.moderateRecipe(id, status);

      return res.json(result);
    } catch (err) {
      next(err);
    }
  };

  moderateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = moderationIdParamSchema.parse(req.params);
      const { status } = moderationActionSchema.parse(req.body);

      const result = await this.service.moderateCategory(id, status);

      return res.json(result);
    } catch (err) {
      next(err);
    }
  };

  moderateIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = moderationIdParamSchema.parse(req.params);
      const { status } = moderationActionSchema.parse(req.body);

      const result = await this.service.moderateIngredient(id, status);

      return res.json(result);
    } catch (err) {
      next(err);
    }
  };
}