import z from "zod";
import { all, get, run } from "../db/dbClient.js";
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
    const sql = `
      SELECT c.*, u.name as authorName 
      FROM Comments c 
      JOIN Users u ON c.authorId = u.id 
      WHERE c.postId = ? AND c.isDeleted = 0
      ORDER BY c.id ASC; 
    `;
    const rows = await all(sql, [Number(postId)]);
    return rows.map(mapToComment);
  },

  getById: async (id: string): Promise<Comment | null> => {
    const sql = `
      SELECT c.*, u.name as authorName 
      FROM Comments c 
      JOIN Users u ON c.authorId = u.id 
      WHERE c.id = ? AND c.isDeleted = 0;
    `;
    const row = await get(sql, [Number(id)]);
    return row ? mapToComment(row) : null; 
  },

  create: async (data: CreateCommentData): Promise<Comment> => {
    const sql = `
      INSERT INTO Comments (postId, authorId, text, date, isDeleted) 
      VALUES (?, ?, ?, ?, 0);
    `;
    const result = await run(sql, [data.postId, data.authorId, data.text, data.date]);

    const createdSql = `
      SELECT c.*, u.name as authorName 
      FROM Comments c 
      JOIN Users u ON c.authorId = u.id 
      WHERE c.id = ?;
    `;
    const row = await get(createdSql, [result.lastID]);
    return mapToComment(row);
  },

  update: async (
    id: string,
    updatedFields: { text?: string | undefined },
  ): Promise<Comment | null> => {

    const sql = `UPDATE Comments SET text = ? WHERE id = ? AND isDeleted = 0;`;
    const result = await run(sql, [updatedFields.text || "", Number(id)]);
    if (result.changes === 0) return null;

    return await commentsRepository.getById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const sql = `UPDATE Comments SET isDeleted = 1 WHERE id = ?;`;
    const result = await run(sql, [Number(id)]);
    return result.changes > 0;
  },
};
