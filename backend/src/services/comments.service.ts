import { commentsRepository } from "../repositories/comments.repository.js";
import type { CreateCommentDto, UpdateCommentDto, CommentViewDto } from "../dtos/comments.dto.js";


function toCommentViewDto(comment: any): CommentViewDto {
  return {
    id: String(comment.id),
    text: comment.text,
    author: comment.authorName, 
    postId: String(comment.postId),
    date: comment.date,
  };
}

export const commentsService = {
  getByPostId: async (postId: string): Promise<CommentViewDto[]> => {
    const comments = await commentsRepository.getCommentsByPostId(postId);
    return comments.map(toCommentViewDto);
  },

  create: async (dto: CreateCommentDto): Promise<CommentViewDto> => {
    const newComment = {
      text: dto.text,
      authorId: dto.authorId,
      postId: dto.postId,
      date: new Date().toISOString(),
    };
    const createdComment = await commentsRepository.create(newComment);
    return toCommentViewDto(createdComment);
  },

  update: async (id: string, dto: UpdateCommentDto): Promise<CommentViewDto> => {
    const updatedComment = await commentsRepository.update(id, dto);
    if (!updatedComment) throw new Error("Коментар не знайдено");
    return toCommentViewDto(updatedComment);
  },

  delete: async (id: string): Promise<boolean> => {
    const isDeleted = await commentsRepository.delete(id);
    if (!isDeleted) throw new Error("Коментар не знайдено");
    return true;
  },
};