import express, { type Request, type Response } from "express";
import { postsRouter } from "./routes/posts.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { migrate } from "./db/migrate.js";
import { commentsRouter } from "./routes/comments.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./middleware/logger.middleware.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use(logger);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);
app.use(errorHandler);
async function startServer() {
  try {
    await migrate();

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
  } catch(error) {
    console.error("Помилка при запуску сервера:", error);
    process.exit(1);
  }
}
startServer();
