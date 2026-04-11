import { postsController } from "../controllers/posts.controller.js";
import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { CreatePostSchema, UpdatePostSchema } from "../dtos/posts.dto.js";
import { allowedCategories } from "../dtos/posts.dto.js";
export const postsRouter = Router();
postsRouter.get("/", postsController.list);
postsRouter.get("/categories", (req, res) => {
    res.json({ data: allowedCategories });
});
postsRouter.get("/stats", postsController.stats);
postsRouter.get("/:id", postsController.getById);
postsRouter.post("/", validate(CreatePostSchema), postsController.create);
postsRouter.patch("/:id", validate(UpdatePostSchema), postsController.update);
postsRouter.delete("/:id", postsController.delete);
