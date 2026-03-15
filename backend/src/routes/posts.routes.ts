import { postsController } from "../controllers/posts.controller.js";
import { Router } from "express";
export const postsRouter = Router();
postsRouter.get('/', postsController.getAll);
postsRouter.get('/:id', postsController.getById);
postsRouter.post('/', postsController.create);
postsRouter.patch('/:id', postsController.update);
postsRouter.delete('/:id', postsController.delete);