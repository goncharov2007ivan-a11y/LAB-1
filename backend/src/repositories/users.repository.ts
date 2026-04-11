import { all, get, run, escapeSqlString } from "../db/dbClient.js";

export const usersRepository = {
  getAll: async (): Promise<any[]> => {
    const sql = `SELECT * FROM Users WHERE isDeleted = 0 ORDER BY id DESC;`;
    return await all<any>(sql);
  },

  getById: async (id: string): Promise<any | undefined> => {
    const userId = Number(id);
    const sql = `SELECT * FROM Users WHERE id = ${userId} AND isDeleted = 0;`;
    return await get<any>(sql);
  },

  create: async (data: { name: string; email: string; date: string }): Promise<any> => {
    const safeName = escapeSqlString(data.name);
    const safeEmail = escapeSqlString(data.email);
    const safeDate = escapeSqlString(data.date);

    const sql = `
      INSERT INTO Users (name, email, date, isDeleted) 
      VALUES ('${safeName}', '${safeEmail}', '${safeDate}', 0);
    `;
    const result = await run(sql);
    
    const createdSql = `SELECT * FROM Users WHERE id = ${result.lastID};`;
    return await get<any>(createdSql);
  },

  update: async (id: string, updatedFields: { name?: string | undefined; email?: string | undefined}): Promise<any | null> => {
    const userId = Number(id);
    let setQuery = [];
    
    if (updatedFields.name) setQuery.push(`name = '${escapeSqlString(updatedFields.name)}'`);
    if (updatedFields.email) setQuery.push(`email = '${escapeSqlString(updatedFields.email)}'`);

    if (setQuery.length === 0) return await usersRepository.getById(id);

    const sql = `UPDATE Users SET ${setQuery.join(", ")} WHERE id = ${userId} AND isDeleted = 0;`;
    const result = await run(sql);
    
    if (result.changes === 0) return null;
    return await usersRepository.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const userId = Number(id);
    const sql = `UPDATE Users SET isDeleted = 1 WHERE id = ${userId};`;
    const result = await run(sql);
    return result.changes > 0;
  },
};
