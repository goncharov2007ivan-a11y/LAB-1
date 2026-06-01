import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { CreateUserSchema, LoginUserSchema, UpdateUserSchema } from "../../../shared/dtos/users.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const usersRouter = Router();

usersRouter.get("/", usersController.getAll);
usersRouter.get("/:id", usersController.getById);
usersRouter.post("/", validate(CreateUserSchema), usersController.create);
usersRouter.post("/login", validate(LoginUserSchema), usersController.login);

usersRouter.patch("/:id", authMiddleware, validate(UpdateUserSchema), usersController.update);
usersRouter.delete("/:id", authMiddleware, usersController.delete);
