import type { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const usersController = {
  getAll: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await usersService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  getById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const user = await usersService.getById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  create: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newUser = await usersService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
  login: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await usersService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  update: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const currentUserId = (req as AuthRequest).userId as string;

      const updatedUser = await usersService.update(id, currentUserId, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
  delete: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const currentUserId = (req as AuthRequest).userId as string;

      await usersService.delete(id, currentUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
