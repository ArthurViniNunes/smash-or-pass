import { NextFunction, Request, Response } from "express";

import { UsersService } from "./users.service";
import { updateProfileSchema } from "./users.schemas";

export class UsersController {
  private service = new UsersService();

  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = updateProfileSchema.parse(req.body);

      const user = await this.service.updateProfile(
        req.user!.id,
        data
      );

      return res.json(user);
    } catch (error) {
      next(error);
    }
  };
}