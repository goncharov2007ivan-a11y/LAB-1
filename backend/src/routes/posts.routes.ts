import { postsController } from "../controllers/posts.controller.js";
import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { CreatePostSchema, UpdatePostSchema } from "../../../shared/dtos/posts.dto.js";
import { allowedCategories } from "../../../shared/dtos/posts.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
export const postsRouter = Router();
postsRouter.get("/", postsController.list);
postsRouter.get("/categories", (req, res) => {
  res.json({ data: allowedCategories });
});
postsRouter.get("/stats", postsController.stats);
postsRouter.get("/:id", postsController.getById);

postsRouter.post("/", authMiddleware, validate(CreatePostSchema), postsController.create);
postsRouter.patch("/:id", authMiddleware, validate(UpdatePostSchema), postsController.update);
postsRouter.delete("/:id", authMiddleware, postsController.delete);
