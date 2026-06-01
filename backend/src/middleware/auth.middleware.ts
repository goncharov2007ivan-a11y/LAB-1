import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Відсутній токен авторизації" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Невірний формат токена" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Критична помилка сервера: JWT_SECRET не налаштовано");
    }

    const decoded = jwt.verify(token, secret) as { userId: string };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: "Недійсний або прострочений токен" });
  }
};