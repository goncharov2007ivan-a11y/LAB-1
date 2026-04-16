import type { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service.js";

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
  update: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updatedUser = await usersService.update(id, req.body);
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
      await usersService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
