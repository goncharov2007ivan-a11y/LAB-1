import { all, get, run, escapeSqlString } from "../db/dbClient.js";

interface CreateCommentData {
  text: string;
  authorId: number;
  postId: number;
  date: string;
}

export const commentsRepository = {
  getCommentsByPostId: async (postId: string): Promise<any[]> => {
    const pId = Number(postId);
    const sql = `
      SELECT c.*, u.name as authorName 
      FROM Comments c 
      JOIN Users u ON c.authorId = u.id 
      WHERE c.postId = ${pId} AND c.isDeleted = 0
      ORDER BY c.id ASC; 
    `;
    return await all<any>(sql);
  },

  create: async (data: CreateCommentData): Promise<any> => {
    const safeText = escapeSqlString(data.text);
    const safeDate = escapeSqlString(data.date);

    const sql = `
      INSERT INTO Comments (postId, authorId, text, date, isDeleted) 
      VALUES (${data.postId}, ${data.authorId}, '${safeText}', '${safeDate}', 0);
    `;
    const result = await run(sql);

    const createdSql = `
      SELECT c.*, u.name as authorName 
      FROM Comments c 
      JOIN Users u ON c.authorId = u.id 
      WHERE c.id = ${result.lastID};
    `;
    return await get<any>(createdSql);
  },

  update: async (
    id: string,
    updatedFields: { text?: string | undefined },
  ): Promise<any | null> => {
    const commentId = Number(id);
    const safeText = escapeSqlString(updatedFields.text || "");

    const sql = `UPDATE Comments SET text = '${safeText}' WHERE id = ${commentId} AND isDeleted = 0;`;
    const result = await run(sql);
    if (result.changes === 0) return null;

    const getSql = `
      SELECT c.*, u.name as authorName 
      FROM Comments c JOIN Users u ON c.authorId = u.id 
      WHERE c.id = ${commentId};
    `;
    return await get<any>(getSql);
  },

  delete: async (id: string): Promise<boolean> => {
    const commentId = Number(id);
    const sql = `UPDATE Comments SET isDeleted = 1 WHERE id = ${commentId};`;
    const result = await run(sql);
    return result.changes > 0;
  },
};
