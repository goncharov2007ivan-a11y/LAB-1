import type { Comment } from "../dtos/comments.dto.js";

let comments: Comment[] = [];
export const commentsRepository = {
  getAll: async (): Promise<Comment[]> => {
    return comments;
  },
  getById: async (id: string): Promise<Comment | undefined> => {
    return comments.find((comment) => comment.id === id);
  },
  create: async (comment: Comment): Promise<Comment> => {
    comments.push(comment);
    return comment;
  },
  update: async (
    id: string,
    updatedFields: Partial<Comment>,
  ): Promise<Comment | null> => {
    const index = comments.findIndex((comment) => comment.id === id);
    if (index === -1) return null;
    comments[index] = { ...comments[index], ...updatedFields } as Comment;
    return comments[index];
  },
  delete: async (id: string): Promise<boolean> => {
    const index = comments.findIndex((comment) => comment.id === id);
    if (index === -1) return false;

    comments[index]!.isDeleted = true;
    return true;
  },
};
