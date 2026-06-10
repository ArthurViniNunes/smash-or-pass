import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { HttpError } from "../utils/http-error";

type JwtPayload = {
  role: string;
  sub: string;
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new HttpError(401, "Token not provided");
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new HttpError(401, "Invalid token");
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as JwtPayload & jwt.JwtPayload;

    req.user = {
      id: decoded.sub as string,
      role: decoded.role as any,
    };

    next();
  } catch {
    throw new HttpError(401, "Invalid token");
  }
}