import { usersRepository } from "../repositories/users.repository.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  UserViewDto,
} from "../dtos/users.dto.js";

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
    const newUserData = {
      name: dto.name,
      email: dto.email,
      date: new Date().toISOString(),
    };
    const createdUser = await usersRepository.create(newUserData);
    return toUserViewDto(createdUser);
  },

  update: async (id: string, dto: UpdateUserDto): Promise<UserViewDto> => {
    const updatedUser = await usersRepository.update(id, dto);
    if (!updatedUser) throw new Error("Користувача не знайдено");
    return toUserViewDto(updatedUser);
  },

  delete: async (id: string): Promise<void> => {
    const isDeleted = await usersRepository.delete(id);
    if (!isDeleted) throw new Error("Користувача не знайдено");
  },
};
