import { NextFunction, Request, Response } from "express";

import { UsersService } from "./users.service";
import { updateProfileSchema, updateUserAllergensSchema, updateUserDietPreferencesSchema } from "./users.schemas";

export class UsersController {
  private service = new UsersService();

  listUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.service.listUsers();

      return res.json(users);
    } catch (error) {
      next(error);
    }
  };

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

  getAllergens = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data =
        await this.service.getAllergens(
          req.user!.id
        );

      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  updateAllergens = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { allergenIds } =
        updateUserAllergensSchema.parse(
          req.body
        );

      const data =
        await this.service.updateAllergens(
          req.user!.id,
          allergenIds
        );

      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getDietPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data =
        await this.service.getDietPreferences(
          req.user!.id
        );

      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  updateDietPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { dietPreferenceIds } =
        updateUserDietPreferencesSchema.parse(
          req.body
        );

      const data =
        await this.service.updateDietPreferences(
          req.user!.id,
          dietPreferenceIds
        );

      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getSmashs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data =
        await this.service.getSmashs(
          req.user!.id
        );

      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  updateAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const file = req.file;

      const user = await this.service.updateAvatar(
        req.user!.id,
        file,
      );

      return res.json(user);
    } catch (error) {
      next(error);
    }
  };
}