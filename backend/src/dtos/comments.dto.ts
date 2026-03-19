import { z } from "zod";
export interface Comment {
  id: string;
  text: string;
  authorID: string;
  postID: string;
  date: string;
  isDeleted: boolean;
}
export const CreateCommentSchema = z.object({
  body: z.object({
    text: z
      .string({ message: "Текст обов'язковий" })
      .min(1, "Коментар не може бути порожнім")
      .max(1000, "Коментар не може бути довшим за 1000 символів"),
    authorID: z
      .string({ message: "ID автора обов'язкове" })
      .min(1, "Вкажіть ім'я автора"),
    postID: z
      .string({ message: "ID поста обов'язкове" })
      .min(1, "Вкажіть пост"),
  }),
});

export const UpdateCommentSchema = z.object({
  body: CreateCommentSchema.shape.body.partial(),
});
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>["body"];
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>["body"];
export interface CommentViewDto {
  id: string;
  text: string;
  authorID: string;
  postID: string;
  date: string;
}
export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
