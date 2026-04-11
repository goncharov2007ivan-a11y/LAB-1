import type { Request, Response, NextFunction } from "express";
import { commentsService } from "../services/comments.service.js";

export const commentsController = {
  getByPostId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.params.postId as string;
      const comments = await commentsService.getByPostId(postId);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newComment = await commentsService.create(req.body);
      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updatedComment = await commentsService.update(id, req.body);
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await commentsService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};