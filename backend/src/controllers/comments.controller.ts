import type { Request, Response, NextFunction } from "express";
import { commentsService } from "../services/comments.service.js";

export const commentsController = {
  getByPostId: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const postId = req.params.postId as string;
      const comments = await commentsService.getByPostId(postId);
      res.status(200).json(comments);
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
      const { postId, text } = req.body;
      const currentUserId = req.headers["User-id"] as string;

      const comment = await commentsService.create({
        postId,
        authorId: currentUserId,
        text,
      });

      res.status(201).json(comment);
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
      const currentUserId = req.headers['User-id'] as string;
      
      const updatedComment = await commentsService.update(id, currentUserId, req.body);
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
      const currentUserId = req.headers['user-id'] as string;

      await commentsService.delete(id, currentUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
