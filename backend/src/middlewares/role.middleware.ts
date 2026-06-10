import { NextFunction, Request, Response } from "express";

import { RoleName } from "../generated/prisma";

import { HttpError } from "../utils/http-error";

export function roleMiddleware(...roles: RoleName[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new HttpError(401, "Unauthenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, "Forbidden");
    }

    next();
  };
}