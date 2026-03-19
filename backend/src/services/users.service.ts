import { usersRepository } from '../repositories/users.repository.js';
import type { CreateUserDto, UpdateUserDto, UserViewDto, ListResponse, User } from '../dtos/users.dto.js';
import { randomUUID } from "node:crypto";
export interface ListUserOptions {
  limit: number;
  offset: number;
  search?: string | undefined;
  dateSort?: string | undefined;
}
function toUserViewDto(user: User): UserViewDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    date: user.date
  };
}
export const usersService = {
  list: async (options: ListUserOptions): Promise<ListResponse<UserViewDto>> => {
    const { limit, offset, search, dateSort } = options;
    let allUsers = await usersRepository.getAll();
    allUsers = allUsers.filter(u => !u.isDeleted)
    // filter
   
    if (search) {
      const lowerSearch = search.toLowerCase();
      allUsers = allUsers.filter(u => u.name.toLowerCase().includes(lowerSearch));
    }
    if (dateSort) {
      allUsers.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateSort === "asc" ? dateA-dateB : dateB-dateA;
      });
    }
    // пагінація
    const totalItems = allUsers.length;
    let paginatedUsers = allUsers.slice(offset, offset + limit);
    return {
      items: paginatedUsers.map(toUserViewDto),
      total: totalItems,
      limit,
      offset
    };
  },
  getById: async (id:string): Promise<UserViewDto> => {
    const user = await usersRepository.getById(id);
    if (!user || user.isDeleted) {
      throw new Error("Користувача не знайдено");
    }
    return toUserViewDto(user);
  },
  create: async (dto: CreateUserDto): Promise<UserViewDto> => {
    const newUser: User = {
      id: randomUUID(),
      ...dto,
      date: new Date().toISOString(),
      isDeleted: false
    };
    const createdUser = await usersRepository.create(newUser);
    return toUserViewDto(createdUser);
  },
  update: async (id: string, dto: UpdateUserDto): Promise<UserViewDto> => {
    const existingUser = await usersRepository.getById(id);
    if (!existingUser || existingUser.isDeleted) {
      throw new Error("Користувача не знайдено");
    }
    const updatedUser = await usersRepository.update(id, dto as Partial<User>);
    return toUserViewDto(updatedUser!);
  },
  delete: async (id: string): Promise<boolean> => {
    const existingUser =await usersRepository.getById(id);
    if (!existingUser || existingUser.isDeleted) {
      throw new Error("Користувача не знайдено");
    }
    return usersRepository.delete(id);
  }
};