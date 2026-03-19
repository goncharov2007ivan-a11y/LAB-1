import type { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service.js";
export const usersController = {
  list: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      
      const search = req.query.search as string | undefined;
      const dateSort = req.query.dateSort as string | undefined;

      const result = await usersService.list({ limit, offset, search, dateSort });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const user = await usersService.getById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body;
      const newUser = await usersService.create(dto);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    const id = req.params.id as string;
    const dto = req.body;
    const updatedUser = await usersService.update(id, dto);
    res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    const id = req.params.id as string;
    await usersService.delete(id);
    res.status(204).send();
    } catch(error) {
      next(error);
    }
  },
};
