import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(`[Error]: ${err}`);
  if (err instanceof ZodError) {
        res.status(400).json({
            message: "Помилка валідації даних",
            errors: err.issues
        });
        return;
    }
    if (err instanceof Error) {
    
    if (err.message.includes("UNIQUE constraint failed")) {
      res.status(409).json({ message: "Дані вже існують (порушення унікальності)" });
      return;
    }
    
    if (err.message === "Пост не знайдено" || err.message === "Користувача не знайдено" || err.message === "Коментар не знайдено") {
      res.status(404).json({ message: err.message }); 
      return;
    }

    if (err.message === "Необхідна авторизація") {
      res.status(401).json({ message: err.message });
      return;
    }

    if (err.message === "Доступ заборонено") {
      res.status(403).json({ message: err.message });
      return;
    }

    console.error(" CRITICAL ERROR:", err.message, err.stack);
    res.status(500).json({ 
      message: "Внутрішня помилка сервера. Спробуйте пізніше." 
    });
    return;
  }

  res.status(500).json({ 
    message: "Сталася невідома помилка сервера", 
    details: String(err) 
  });
};
