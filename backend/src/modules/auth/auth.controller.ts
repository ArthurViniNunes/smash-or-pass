import { NextFunction, Request, Response } from "express";

import { AuthService } from "./auth.service";

import {
  loginSchema,
  registerSchema,
} from "./auth.schemas";

export class AuthController {
  private service = new AuthService();

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = registerSchema.parse(req.body);

      const user = await this.service.register(data);

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = loginSchema.parse(req.body);

      const result = await this.service.login(data);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.service.me(
        req.user!.id
      );

      return res.json(user);
    } catch (error) {
      next(error);
    }
  };
}