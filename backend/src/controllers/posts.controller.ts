import type { Request, Response, NextFunction } from "express";
import { postsService } from "../services/posts.service.js";
import { postsRepository } from "../repositories/posts.repository.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export const postsController = {
  list: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;

      const category = req.query.category as string;
      const search = req.query.search as string;
      const sort = req.query.sort === 'asc' ? 'asc' : 'desc';

      const result = await postsService.list({
        limit,
        offset,
        category,
        search,
        sort,
      });
      res.status(200).json(result);
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
      const post = await postsService.getById(id);
      res.status(200).json(post);
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
      const currentUserId = (req as AuthRequest).userId as string;
      const postData = { ...req.body, authorId: currentUserId };
      const newPost = await postsService.create(postData);
      res.status(201).json(newPost);
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

      const updatedPost = await postsService.update(id, currentUserId, req.body);
      res.status(200).json(updatedPost);
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
      await postsService.delete(id, currentUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  stats: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const stats = await postsRepository.getStats();
      res.status(200).json({ data: stats });
    } catch (error) {
      next(error);
    }
  },
};
