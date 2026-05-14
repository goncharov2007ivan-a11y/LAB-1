import z from "zod";
import { all, get, run, escapeSqlString } from "../db/dbClient.js";
import type { Comment } from "../../../shared/dtos/comments.dto.js";

interface CreateCommentData {
  text: string;
  authorId: string;
  postId: string;
  date: string;
}

const DbCommentRowSchema = z.object({
  id: z.coerce.string(),
  postId: z.coerce.string(),
  authorId: z.coerce.string(),
  text: z.string(),
  date: z.string(),
  authorName: z.string(), 
  isDeleted: z.number().int().min(0).max(1),
});

function mapToComment(row: unknown): Comment {
  const parsedRow = DbCommentRowSchema.parse(row);
  return {
    id: parsedRow.id,
    postId: parsedRow.postId,
    authorId: parsedRow.authorId,
    text: parsedRow.text,
    date: parsedRow.date,
    authorName: parsedRow.authorName,
    isDeleted: parsedRow.isDeleted === 1,
  };
}
export const commentsRepository = {
  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    const pId = Number(postId);
    const sql = `
      SELECT c.*, u.name as authorName 
      FROM Comments c 
      JOIN Users u ON c.authorId = u.id 
      WHERE c.postId = ${pId} AND c.isDeleted = 0
      ORDER BY c.id ASC; 
    `;
    const rows = await all(sql);
    return rows.map(mapToComment);
  },

  create: async (data: CreateCommentData): Promise<Comment> => {
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
    const row = await get(createdSql);
    return mapToComment(row);
  },

  update: async (
    id: string,
    updatedFields: { text?: string | undefined },
  ): Promise<Comment | null> => {
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
    const row = await get(getSql);
    return row ? mapToComment(row) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const commentId = Number(id);
    const sql = `UPDATE Comments SET isDeleted = 1 WHERE id = ${commentId};`;
    const result = await run(sql);
    return result.changes > 0;
  },
};
