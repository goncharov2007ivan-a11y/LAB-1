import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  date: string;
  isDeleted: boolean;
}

export interface UserViewDto {
  id: string;
  name: string;
  email: string;
  date: string;
}

export const CreateUserSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Ім'я обов'язкове" })
      .min(2, "Ім'я має містити мінімум 2 символи"),
    email: z
      .string({ message: "Email обов'язковий" })
      .email("Невірний формат email адреси"),
      password: z
      .string({ message: "Пароль обов'язковий" })
      .min(6, "Пароль має містити мінімум 6 символів"),
  }),
});

export const UpdateUserSchema = z.object({
  body: CreateUserSchema.shape.body.partial(),
});

export const LoginUserSchema = z.object({
  body: z.object({
    email: z.string().email("Невірний формат email"),
    password: z.string().min(1, "Введіть пароль"),
  })
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>["body"];
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>["body"];
export type LoginUserDto = z.infer<typeof LoginUserSchema>["body"];


