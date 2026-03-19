import { commentsRepository } from "../repositories/comments.repository.js";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  CommentViewDto,
  ListResponse,
  Comment,
} from "../dtos/comments.dto.js";
import { randomUUID } from "node:crypto";
export interface ListCommentOptions {
  limit: number;
  offset: number;
  postID?: string | undefined;
  search?: string | undefined;
  dateSort?: string | undefined;
}
function toCommentViewDto(comment: Comment): CommentViewDto {
  return {
    id: comment.id,
    authorID: comment.authorID,
    postID: comment.postID,
    text: comment.text,
    date: comment.date,
  };
}
export const commentsService = {
  list: async (
    options: ListCommentOptions,
  ): Promise<ListResponse<CommentViewDto>> => {
    const { limit, offset, postID, search, dateSort } = options;
    let allComments = await commentsRepository.getAll();
    allComments = allComments.filter((c) => !c.isDeleted);
    // filter
    if (postID) {
      allComments = allComments.filter((c) => c.postID === postID);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      allComments = allComments.filter((c) =>
        c.text.toLowerCase().includes(lowerSearch),
      );
    }
    if (dateSort) {
      allComments.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateSort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    // пагінація
    const totalItems = allComments.length;
    let paginatedComments = allComments.slice(offset, offset + limit);
    return {
      items: paginatedComments.map(toCommentViewDto),
      total: totalItems,
      limit,
      offset,
    };
  },
  getById: async (id: string): Promise<CommentViewDto> => {
    const comment = await commentsRepository.getById(id);
    if (!comment || comment.isDeleted) {
      throw new Error("Коментар не знайдено");
    }
    return toCommentViewDto(comment);
  },
  create: async (dto: CreateCommentDto): Promise<CommentViewDto> => {
    const newComment: Comment = {
      id: randomUUID(),
      ...dto,
      date: new Date().toISOString(),
      isDeleted: false,
    };
    const createdComment = await commentsRepository.create(newComment);
    return toCommentViewDto(createdComment);
  },
  update: async (
    id: string,
    dto: UpdateCommentDto,
  ): Promise<CommentViewDto> => {
    const existingComment = await commentsRepository.getById(id);
    if (!existingComment || existingComment.isDeleted) {
      throw new Error("Коментар не знайдено");
    }
    const updatedComment = await commentsRepository.update(
      id,
      dto as Partial<Comment>,
    );
    return toCommentViewDto(updatedComment!);
  },
  delete: async (id: string): Promise<boolean> => {
    const existingComment = await commentsRepository.getById(id);
    if (!existingComment || existingComment.isDeleted) {
      throw new Error("Коментар не знайдено");
    }
    return commentsRepository.delete(id);
  },
};
