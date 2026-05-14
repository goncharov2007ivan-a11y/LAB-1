import { z } from "zod";
import { all, get, run, escapeSqlString } from "../db/dbClient.js";
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
    const userId = Number(id);
    const sql = `SELECT * FROM Users WHERE id = ${userId} AND isDeleted = 0;`;
    const row = await get(sql);
    return row ? mapToUser(row) : undefined;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const safeName = escapeSqlString(data.name);
    const safeEmail = escapeSqlString(data.email);
    const safeDate = escapeSqlString(data.date);

    const sql = `
      INSERT INTO Users (name, email, date, isDeleted) 
      VALUES ('${safeName}', '${safeEmail}', '${safeDate}', 0);
    `;
    const result = await run(sql);

    const createdSql = `SELECT * FROM Users WHERE id = ${result.lastID};`;
    const row = await get(createdSql);
    return mapToUser(row);
  },

  update: async (
    id: string,
    updatedFields: { name?: string | undefined; email?: string | undefined },
  ): Promise<User | null> => {
    const userId = Number(id);
    let setQuery = [];

    if (updatedFields.name)
      setQuery.push(`name = '${escapeSqlString(updatedFields.name)}'`);
    if (updatedFields.email)
      setQuery.push(`email = '${escapeSqlString(updatedFields.email)}'`);

    if (setQuery.length === 0) return await usersRepository.getById(id) || null;

    const sql = `UPDATE Users SET ${setQuery.join(", ")} WHERE id = ${userId} AND isDeleted = 0;`;
    const result = await run(sql);

    if (result.changes === 0) return null;
    return await usersRepository.getById(id) || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const userId = Number(id);
    const sql = `UPDATE Users SET isDeleted = 1 WHERE id = ${userId};`;
    const result = await run(sql);
    return result.changes > 0;
  },
};


