import express, { type Request, type Response } from "express";
import { postsRouter } from "./routes/posts.routes.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use("/api/v1/posts", postsRouter);
app.listen(port, () => {
  console.log("API працює");
});
