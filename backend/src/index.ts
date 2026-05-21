import express from "express";
import cors from "cors";
import { postsRouter } from "./routes/posts.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { migrate } from "./db/migrate.js";
import { commentsRouter } from "./routes/comments.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./middleware/logger.middleware.js";
import { securityHeaders } from "./middleware/security.middleware.js";
const allowedOrigins = [
  "http://localhost:8080"
]
const app = express();

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb (null, true);
    if (allowedOrigins.includes(origin)) return cb (null, true);
    return cb(new Error("CORS: origin is not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", 'User-Id']
}));
app.use(securityHeaders);
app.options(/.*/, cors());
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
  } catch (error) {
    console.error("Помилка при запуску сервера:", error);
    process.exit(1);
  }
}
startServer();
