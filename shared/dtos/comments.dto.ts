import { z } from "zod";

export interface Comment {
  id: string;
  text: string;
  authorName: string; 
  authorId: string;
  postId: string;
  date: string;
  isDeleted: boolean;
}

export interface CommentViewDto {
  id: string;
  text: string;
  author: string;
  authorId: string; 
  postId: string;
  date: string;
}

export const CreateCommentSchema = z.object({
  body: z.object({
    text: z
      .string({ message: "Текст коментаря обов'язковий" })
      .min(1, "Мінімум 1 символ")
      .max(300, "Максимум 300 символів"),
    authorId: z
      .string({ message: "ID автора повинен бути рядком" }),
    postId: z
      .string({ message: "ID поста повинен бути рядком" }),
  }),
});

export const UpdateCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(300),
  }),
});

export type CreateCommentDto = z.infer<typeof CreateCommentSchema>["body"];
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>["body"];


