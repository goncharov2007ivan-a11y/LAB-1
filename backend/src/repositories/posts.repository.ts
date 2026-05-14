import type { Post } from "../../../shared/dtos/posts.dto.js";
import {z} from "zod";
import { all, get, run, escapeSqlString } from "../db/dbClient.js";

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
    const uId = Number(userId);
    const sql = `
      SELECT p.*, u.name as authorName 
      FROM Posts p 
      JOIN Users u ON p.authorId = u.id 
      WHERE p.authorId = ${uId} AND p.isDeleted = 0
      ORDER BY p.id DESC;
    `;
    const rows = await all(sql);
    return rows.map(mapToPost);
  },

  getById: async (id: string): Promise<Post | undefined> => {
    const postId = Number(id);
    const sql = `
    SELECT p.*, u.name as authorName 
      FROM Posts p 
      JOIN Users u ON p.authorId = u.id 
      WHERE p.id = ${postId} AND p.isDeleted = 0; 
    `;
    const row = await get(sql);
    return row ? mapToPost(row) : undefined;
  },

  create: async (post: CreatePostData): Promise<Post> => {
    const safeCategory = escapeSqlString(post.category);
    const safeContent = escapeSqlString(post.content);
    const safeDate = escapeSqlString(post.date);
    const safeTitle = escapeSqlString(post.title);

    const sql = `
      INSERT INTO Posts (title, category, content, authorId, date, isDeleted) 
      VALUES ('${safeTitle}', '${safeCategory}', '${safeContent}', ${post.authorId}, '${safeDate}', 0);
    `;
    const result = await run(sql);

    const createdPost = `
    SELECT p.id, p.title, p.category, p.content, p.date, p.isDeleted, p.authorId, u.name as authorName 
    FROM Posts p 
    JOIN Users u ON p.authorId = u.id
    WHERE p.id = ${result.lastID};
    `;
    const row = await get(createdPost);
    return mapToPost(row);
  },

  update: async (
    id: string,
    updatedFields: Partial<Post>,
  ): Promise<Post | null> => {
    const postId = Number(id);

    const safeTitle = escapeSqlString(updatedFields.title || "");
    const safeContent = escapeSqlString(updatedFields.content || "");
    const safeCategory = escapeSqlString(updatedFields.category || "");

    const sql = `
      UPDATE Posts 
      SET title = '${safeTitle}', content = '${safeContent}', category = '${safeCategory}'
      WHERE id = ${postId} AND isDeleted = 0;
    `;
    const result = await run(sql);
    if (result.changes === 0) return null;

    const updatedPost = await postsRepository.getById(id);
    return updatedPost || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const postId = Number(id);
    const sql = `UPDATE Posts SET isDeleted = 1 WHERE id = ${postId};`;
    const result = await run(sql);
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

    if (options.search) {
      whereInj += ` AND p.title LIKE '%${options.search}%'`;
    }

    if (options.category && options.category !== "Всі категорії") {
      const safeCategory = escapeSqlString(options.category);
      whereInj += ` AND p.category = '${safeCategory}'`;
    }

    let orderClause = "ORDER BY p.id DESC";
    if (options.sort) {
      orderClause =
        options.sort === "asc"
          ? "ORDER BY p.date ASC"
          : "ORDER BY p.date DESC";
    }

    const countSql = `SELECT COUNT(*) as total FROM Posts p ${whereInj};`;
    const countResult = await get<{ total: number }>(countSql);
    const total = countResult?.total || 0;

    const sql = `
      SELECT p.*, u.name as authorName 
      FROM Posts p 
      JOIN Users u ON p.authorId = u.id 
      ${whereInj}
      ${orderClause}
      LIMIT ${options.limit} OFFSET ${options.offset};
    `;
    const rows = await all(sql);

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
