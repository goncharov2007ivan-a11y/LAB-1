import { z } from "zod";
export interface Post {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  date: string;
  isDeleted: boolean;
}
export const CreatePostSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Заголовок обов'язковий" })
      .min(1, "Заголовок не може бути порожнім")
      .max(70, "Заголовок не може бути довшим за 70 символів"),
    category: z
      .string({ message: "Категорія обов'язкова" })
      .min(1, "Оберіть категорію"),
    content: z
      .string({ message: "Текст поста обов'язковий" })
      .max(500, "Текст не більше 500 символів"),
    author: z
      .string({ message: "Автор обов'язковий" })
      .min(1, "Вкажіть автора"),
  }),
});

export const UpdatePostSchema = z.object({
  body: CreatePostSchema.shape.body.partial(),
});
export type CreatePostDto = z.infer<typeof CreatePostSchema>["body"];
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>["body"];
export interface PostViewDto {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  date: string;
}
export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
