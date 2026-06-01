import { Router } from "express";
import { commentsController } from "../controllers/comments.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from "../../../shared/dtos/comments.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const commentsRouter = Router();

commentsRouter.get("/post/:postId", commentsController.getByPostId);

commentsRouter.post(
  "/",
  authMiddleware,
  validate(CreateCommentSchema),
  commentsController.create,
);
commentsRouter.patch(
  "/:id",
  authMiddleware,
  validate(UpdateCommentSchema),
  commentsController.update,
);
commentsRouter.delete("/:id", authMiddleware, commentsController.delete);
