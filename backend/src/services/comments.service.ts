import { commentsRepository } from "../repositories/comments.repository.js";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  CommentViewDto,
  Comment,
} from "../../../shared/dtos/comments.dto.js";

function toCommentViewDto(comment: Comment): CommentViewDto {
  return {
    id: String(comment.id),
    text: comment.text,
    author: comment.authorName,
    authorId: String(comment.authorId),
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
    if (!dto.authorId) {
      throw new Error("Необхідна авторизація");
    }
    const newComment = {
      text: dto.text,
      authorId: dto.authorId,
      postId: dto.postId,
      date: new Date().toISOString(),
    };
    const createdComment = await commentsRepository.create(newComment);
    return toCommentViewDto(createdComment);
  },

  update: async (
    id: string,
    currentUserId: string,
    dto: UpdateCommentDto,
  ): Promise<CommentViewDto> => {
    if (!currentUserId) throw new Error("Необхідна авторизація");
    
    const comment = await commentsRepository.getById(id);
    if (!comment) throw new Error("Коментар не знайдено");

    if (String(comment.authorId) !== String(currentUserId)) {
      throw new Error("Доступ заборонено");
    }

    const updatedComment = await commentsRepository.update(id, dto);
    if (!updatedComment) throw new Error("Коментар не знайдено");

    return toCommentViewDto(comment);
  },

  delete: async (id: string, currentUserId: string): Promise<boolean> => {
    if (!currentUserId) throw new Error("Необхідна авторизація");

    const comment = await commentsRepository.getById(id);
    if (!comment) throw new Error("Коментар не знайдено");

    if (String(comment.authorId) !== String(currentUserId)) {
      throw new Error("Доступ заборонено");
    }

    return await commentsRepository.delete(id);
  },
};
