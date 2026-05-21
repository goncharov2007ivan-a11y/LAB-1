import type { Post } from "../../../shared/dtos/posts.dto.js";
import {z} from "zod";
import { all, get, run } from "../db/dbClient.js";

interface CreatePostData {
  title: string;
  category: string;
  content: string;
  authorId: string;
  date: string;
}

const DbPostRowSchema = z.object({
  id: z.coerce.string(),
  title: z.string(),
  category: z.string(),
  content: z.string(),
  authorName: z.string(),
  authorId: z.coerce.string(),
  date: z.string(),
  isDeleted: z.number().int().min(0).max(1)
});

function mapToPost(row: unknown): Post {
  const parcedRow = DbPostRowSchema.parse(row);
  return {
    id: parcedRow.id,
    title: parcedRow.title,
    category: parcedRow.category,
    content: parcedRow.content,
    author: parcedRow.authorName,
    authorId: parcedRow.authorId,
    date: parcedRow.date,
    isDeleted: parcedRow.isDeleted === 1,
  };
}

export const postsRepository = {
  getAll: async (): Promise<Post[]> => {
    const sql = `
    SELECT p.*, u.name as authorName
    FROM Posts p
    JOIN Users u ON p.authorId = u.id
    WHERE p.isDeleted = 0  
    ORDER BY p.id DESC;`;
    const rows = await all(sql);
    return rows.map(mapToPost);
  },

  getPostsByUserId: async (userId: string): Promise<Post[]> => {
    const sql = `
      SELECT p.*, u.name as authorName 
      FROM Posts p 
      JOIN Users u ON p.authorId = u.id 
      WHERE p.authorId = ? AND p.isDeleted = 0
      ORDER BY p.id DESC;
    `;
    const rows = await all(sql, [Number(userId)]);
    return rows.map(mapToPost);
  },

  getById: async (id: string): Promise<Post | undefined> => {
    const sql = `
    SELECT p.*, u.name as authorName 
      FROM Posts p 
      JOIN Users u ON p.authorId = u.id 
      WHERE p.id = ? AND p.isDeleted = 0; 
    `;
    const row = await get(sql, [Number(id)]);
    return row ? mapToPost(row) : undefined;
  },

  create: async (post: CreatePostData): Promise<Post> => {
    const sql = `
      INSERT INTO Posts (title, category, content, authorId, date, isDeleted) 
      VALUES (?, ?, ?, ?, ?, 0);
    `;
    const result = await run(sql, [post.title, post.category, post.content, post.authorId, post.date]);

    const createdPost = `
    SELECT p.id, p.title, p.category, p.content, p.date, p.isDeleted, p.authorId, u.name as authorName 
    FROM Posts p 
    JOIN Users u ON p.authorId = u.id
    WHERE p.id = ?;
    `;
    const row = await get(createdPost, [result.lastID]);
    return mapToPost(row);
  },

  update: async (
    id: string,
    updatedFields: Partial<Post>,
  ): Promise<Post | null> => {
    const sql = `
      UPDATE Posts 
      SET title = ?, content = ?, category = ?
      WHERE id = ? AND isDeleted = 0;
    `;
    const result = await run(sql, [
      updatedFields.title || "", 
      updatedFields.content || "", 
      updatedFields.category || "", 
      Number(id)
    ]);
    if (result.changes === 0) return null;

    const updatedPost = await postsRepository.getById(id);
    return updatedPost || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const sql = `UPDATE Posts SET isDeleted = 1 WHERE id = ?`;
    const result = await run(sql, [Number(id)]);
    return result.changes > 0;
  },

  getFiltered: async (options: {
    limit: number;
    offset: number;
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<{ items: Post[]; total: number }> => {
    let whereInj = "WHERE p.isDeleted = 0";
    const params: any[] = [];

    if (options.search) {
      whereInj += ` AND p.title LIKE ?`;
      params.push(`%${options.search}%`);
    }

    if (options.category && options.category !== "Всі категорії") {
      whereInj += ` AND p.category = ?`;
      params.push(options.category);
    }

    let orderClause = "ORDER BY p.id DESC";
    if (options.sort) {
      orderClause =
        options.sort === "asc"
          ? "ORDER BY p.date ASC"
          : "ORDER BY p.date DESC";
    }

    const countSql = `SELECT COUNT(*) as total FROM Posts p ${whereInj};`;
    const countResult = await get<{ total: number }>(countSql, params);
    const total = countResult?.total || 0;

    const sql = `
      SELECT p.*, u.name as authorName 
      FROM Posts p 
      JOIN Users u ON p.authorId = u.id 
      ${whereInj}
      ${orderClause}
      LIMIT ? OFFSET ?;
    `;
    params.push(options.limit, options.offset);
    const rows = await all(sql, params);

    return { items: rows.map(mapToPost), total };
  },

  getStats: async (): Promise<{ category: string; count: number }[]> => {
    const sql = `
      SELECT category, COUNT(*) as count 
      FROM Posts 
      WHERE isDeleted = 0 
      GROUP BY category;
    `;
    return await all(sql);
  },
};
