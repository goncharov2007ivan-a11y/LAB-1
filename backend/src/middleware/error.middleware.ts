import type { Request, Response, NextFunction } from "express";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(`[Error]: ${err.message}`);
  if (err.message.includes("UNIQUE constraint failed")) {
    res.status(409).json({ message: "Дані вже існують (порушення унікальності)" });
    return;
  }
  if (
    err.message === "Пост не знайдено" ||
    err.message === "Користувача не знайдено"
  ) {
    res.status(404).json({ message: "Пост не знайдено" });
    return;
  }
  res.status(500).json({ message: "Внутрішня помилка сервера" });
};
