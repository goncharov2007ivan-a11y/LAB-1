import { z } from "zod";
export interface Post {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  authorId: number;
  date: string;
  isDeleted: boolean;
}
export const allowedCategories = [
  "Новини",
  "Події",
  "Загублені речі",
  "Навчання",
  "Спорт",
  "Меми",
];
export const CreatePostSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Заголовок обов'язковий" })
      .min(1, "Заголовок не може бути порожнім")
      .max(70, "Заголовок не може бути довшим за 70 символів"),
    category: z.enum(allowedCategories, {
      message: "Невірна категорія, оберіть одну із дозволених.",
    }),
    content: z
      .string({ message: "Текст поста обов'язковий" })
      .max(500, "Текст не більше 500 символів"),
    authorId: z
      .number({ message: "ID автора обов'язковий" })
      .positive("ID має бути додатнім"),
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
  authorId: number;
  date: string;
}
export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
