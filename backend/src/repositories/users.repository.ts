import type { User } from "../dtos/users.dto.js";


let users: User[] = [];
export const usersRepository = {
  getAll: async ():  Promise<User[]> => {
    return users;
  },
  getById: async (id: string): Promise<User | undefined> => {
    return users.find((user) => user.id === id);
  },
  create: async (user: User): Promise<User> => {
        users.push(user);
        return user;
    },
    update: async (id: string, updatedFields: Partial<User>): Promise<User | null> => {
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return null;
        users[index] = { ...users[index], ...updatedFields } as User;
        return users[index];
    },
    delete: async (id: string): Promise<boolean> => {
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return false;

        users[index]!.isDeleted = true;
        return true;
    }
};
