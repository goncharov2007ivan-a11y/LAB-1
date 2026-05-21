import { z } from "zod";
import { all, get, run } from "../db/dbClient.js";
import type { User } from "../../../shared/dtos/users.dto.js";

interface CreateUserData {
  name: string;
  email: string;
  date: string;
}

const DbUserRowSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.string(),
  date: z.string(),
  isDeleted: z.number().int().min(0).max(1)
});

function mapToUser(row: unknown): User {
  const parsedRow = DbUserRowSchema.parse(row);
  return {
    id: parsedRow.id,
    name: parsedRow.name,
    email: parsedRow.email,
    date: parsedRow.date,
    isDeleted: parsedRow.isDeleted === 1,
  };
}

export const usersRepository = {
  getAll: async (): Promise<User[]> => {
    const sql = `SELECT * FROM Users WHERE isDeleted = 0 ORDER BY id DESC;`;
    const rows = await all(sql);
    return rows.map(mapToUser);
  },

  getById: async (id: string): Promise<User | undefined> => {
    const sql = `SELECT * FROM Users WHERE id = ? AND isDeleted = 0;`;
    const row = await get(sql, [Number(id)]);
    return row ? mapToUser(row) : undefined;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const sql = `
      INSERT INTO Users (name, email, date, isDeleted) 
      VALUES (?, ?, ?, 0);
    `;
    const result = await run(sql, [data.name, data.email, data.date]);

    const createdSql = `SELECT * FROM Users WHERE id = ?;`;
    const row = await get(createdSql, [result.lastID]);
    return mapToUser(row);
  },

  update: async (
    id: string,
    updatedFields: { name?: string | undefined; email?: string | undefined },
  ): Promise<User | null> => {
    let setQuery = [];
    let params = []; 

    if (updatedFields.name) {
      setQuery.push(`name = ?`);
      params.push(updatedFields.name);
    }
    if (updatedFields.email) {
      setQuery.push(`email = ?`);
      params.push(updatedFields.email);
    }

    if (setQuery.length === 0) return await usersRepository.getById(id) || null;

    params.push(Number(id));

    const sql = `UPDATE Users SET ${setQuery.join(", ")} WHERE id = ? AND isDeleted = 0;`;
    const result = await run(sql, params);

    if (result.changes === 0) return null;
    return await usersRepository.getById(id) || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const sql = `UPDATE Users SET isDeleted = 1 WHERE id = ?;`;
    const result = await run(sql, [Number(id)]);
    return result.changes > 0;
  },
};


