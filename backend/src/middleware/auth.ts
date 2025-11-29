import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

export interface AuthRequest extends Request {
  userId?: string;
}

interface JwtPayload {
  userId: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Требуется авторизация", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Токен не предоставлен", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Недействительный токен", 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Токен истёк", 401));
    }
    next(error);
  }
};

