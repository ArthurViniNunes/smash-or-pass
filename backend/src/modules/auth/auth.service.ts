import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";

import { HttpError } from "../../utils/http-error";

import { LoginDto, RegisterDto } from "./auth.schemas";

export class AuthService {
  async register(data: RegisterDto) {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingEmail) {
      throw new HttpError(409, "Email already in use");
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (existingUsername) {
      throw new HttpError(409, "Username already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        passwordHash,
      },
    });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new HttpError(401, "Invalid credentials");
    }

    const accessToken = jwt.sign(
      {
        role: user.role,
      },
      env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "7d",
      }
    );

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    };
  }
  
  async me(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
  };
}
}