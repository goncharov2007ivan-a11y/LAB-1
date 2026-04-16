import { z } from "zod";

export const CreateCommentSchema = z.object({
  body: z.object({
    text: z
      .string({ message: "Текст коментаря обов'язковий" })
      .min(1, "Мінімум 1 символ")
      .max(300, "Максимум 300 символів"),
    authorId: z
      .number({ message: "ID автора обов'язковий" })
      .positive("ID має бути додатнім"),
    postId: z
      .number({ message: "ID поста обов'язковий" })
      .positive("ID має бути додатнім"),
  }),
});

export const UpdateCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(300),
  }),
});

export type CreateCommentDto = z.infer<typeof CreateCommentSchema>["body"];
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>["body"];

export interface CommentViewDto {
  id: string;
  text: string;
  author: string;
  postId: string;
  date: string;
}
