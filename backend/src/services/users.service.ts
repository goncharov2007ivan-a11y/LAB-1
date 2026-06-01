import { usersRepository } from "../repositories/users.repository.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  UserViewDto,
  LoginUserDto
} from "../../../shared/dtos/users.dto.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function toUserViewDto(user: any): UserViewDto {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    date: user.date,
  };
}

export const usersService = {
  getAll: async (): Promise<UserViewDto[]> => {
    const users = await usersRepository.getAll();
    return users.map(toUserViewDto);
  },

  getById: async (id: string): Promise<UserViewDto> => {
    const user = await usersRepository.getById(id);
    if (!user) throw new Error("Користувача не знайдено");
    return toUserViewDto(user);
  },

  create: async (dto: CreateUserDto): Promise<UserViewDto> => {

    const existingUser = await usersRepository.getByEmailWithPassword(dto.email);
    if (existingUser) {
      throw new Error("Користувач з таким email вже існує");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const newUserData = {
      name: dto.name,
      email: dto.email,
      passwordHash: passwordHash,
      date: new Date().toISOString(),
    };
    const createdUser = await usersRepository.create(newUserData);
    return toUserViewDto(createdUser);
  },

  login: async (dto: LoginUserDto): Promise<{ token: string, user: UserViewDto }> => {
    const userRaw = await usersRepository.getByEmailWithPassword(dto.email);
    if (!userRaw) {
      throw new Error("Невірний email або пароль");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, userRaw.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Невірний email або пароль");
    }

    const superMegaSecret = process.env.JWT_SECRET;
    if (!superMegaSecret) {
      throw new Error("Критична помилка, JWT не налаштовано");
    }

    const token = jwt.sign({ userId: userRaw.id}, superMegaSecret, {expiresIn: "24h"});

    return { token, user: toUserViewDto(userRaw) };
  },

  update: async (id: string, currentUserId: string, dto: UpdateUserDto): Promise<UserViewDto> => {
    if (!currentUserId) throw new Error("Необхідна авторизація");

    if (String(id) !== String(currentUserId)) {
      throw new Error("Доступ заборонено");
    }

    const updatedUser = await usersRepository.update(id, dto);
    if (!updatedUser) throw new Error("Користувача не знайдено");
    return toUserViewDto(updatedUser);
  },

  delete: async (id: string, currentUserId: string): Promise<void> => {
    if (!currentUserId) throw new Error("Необхідна авторизація");

    if (String(id) !== String(currentUserId)) {
      throw new Error("Доступ заборонено");
    }

    const isDeleted = await usersRepository.delete(id);
    if (!isDeleted) throw new Error("Користувача не знайдено");
  },
};
