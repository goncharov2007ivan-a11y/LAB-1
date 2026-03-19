import express, { type Request, type Response } from "express";
import { postsRouter } from "./routes/posts.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./middleware/logger.middleware.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use(logger);
app.use("/api/v1/posts", postsRouter);
app.use(errorHandler);
app.listen(port, () => {
  console.log("API працює");
});
