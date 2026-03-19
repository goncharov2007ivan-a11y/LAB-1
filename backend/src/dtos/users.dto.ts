import { z } from "zod";
export interface User {
    id: string;
    name: string;
    email: string;
    date: string;
    isDeleted: boolean;
}
export const CreateUserSchema = z.object({
    body: z.object({
       name: z.string({message: "Ім'я обов'язкове"})
       .min(2, "Ім'я не може бути коротшим за 2 символи")
       .max(50, "Ім'я не може бути довшим за 50 символів"),
       email: z.string({message: "Email обов'язковий"}).email("Некоректний формат email")
    })
});

export const UpdateUserSchema = z.object({
    body: CreateUserSchema.shape.body.partial()
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>["body"];
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>["body"];
export interface UserViewDto {
    id: string;
    name: string;
    email: string;
    date: string;
}
export interface ListResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}