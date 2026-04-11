import { z } from "zod";

export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string({ message: "Ім'я обов'язкове" }).min(2, "Ім'я має містити мінімум 2 символи"),
    email: z.string({ message: "Email обов'язковий" }).email("Невірний формат email адреси"),
  }),
});

export const UpdateUserSchema = z.object({
  body: CreateUserSchema.shape.body.partial(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>["body"];
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>["body"];

export interface UserViewDto {
  id: string;
  name: string;
  email: string;
  date: string;
}
