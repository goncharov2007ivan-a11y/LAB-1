import type { Request, Response, NextFunction } from "express";
import { commentsService } from "../services/comments.service.js";
export const commentsController = {
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

      const postID = req.query.postID as string | undefined;
      const search = req.query.search as string | undefined;
      const dateSort = req.query.dateSort as string | undefined;

      const result = await commentsService.list({
        limit,
        offset,
        search,
        dateSort,
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
      const comment = await commentsService.getById(id);
      res.status(200).json(comment);
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
      const dto = req.body;
      const newComment = await commentsService.create(dto);
      res.status(201).json(newComment);
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
      const dto = req.body;
      const updatedComment = await commentsService.update(id, dto);
      res.status(200).json(updatedComment);
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
      await commentsService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
