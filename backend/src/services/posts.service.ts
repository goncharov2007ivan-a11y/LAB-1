import { postsRepository } from "../repositories/posts.repository.js";
import type {
  CreatePostDto,
  UpdatePostDto,
  PostViewDto,
  ListResponse,
  Post,
} from "../dtos/posts.dto.js";
import { randomUUID } from "node:crypto";
export interface ListPostOptions {
  limit: number;
  offset: number;
  category?: string | undefined;
  search?: string | undefined;
  dateSort?: string | undefined;
}
function toPostViewDto(post: Post): PostViewDto {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    content: post.content,
    author: post.author,
    date: post.date,
  };
}
export const postsService = {
  list: async (
    options: ListPostOptions,
  ): Promise<ListResponse<PostViewDto>> => {
    const { limit, offset, category, search, dateSort } = options;
    let allPosts = await postsRepository.getAll();
    allPosts = allPosts.filter((p) => !p.isDeleted);
    // filter
    if (category && category != "Всі категорії") {
      allPosts = allPosts.filter((p) => p.category === category);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      allPosts = allPosts.filter((p) =>
        p.title.toLowerCase().includes(lowerSearch),
      );
    }
    if (dateSort) {
      allPosts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateSort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    // пагінація
    const totalItems = allPosts.length;
    let paginatedPosts = allPosts.slice(offset, offset + limit);
    return {
      items: paginatedPosts.map(toPostViewDto),
      total: totalItems,
      limit,
      offset,
    };
  },
  getById: async (id: string): Promise<PostViewDto> => {
    const post = await postsRepository.getById(id);
    if (!post || post.isDeleted) {
      throw new Error("Пост не знайдено");
    }
    return toPostViewDto(post);
  },
  create: async (dto: CreatePostDto): Promise<PostViewDto> => {
    const newPost: Post = {
      id: randomUUID(),
      ...dto,
      date: new Date().toISOString(),
      isDeleted: false,
    };
    const createdPost = await postsRepository.create(newPost);
    return toPostViewDto(createdPost);
  },
  update: async (id: string, dto: UpdatePostDto): Promise<PostViewDto> => {
    const existingPost = await postsRepository.getById(id);
    if (!existingPost || existingPost.isDeleted) {
      throw new Error("Пост не знайдено");
    }
    const updatedPost = await postsRepository.update(id, dto as Partial<Post>);
    return toPostViewDto(updatedPost!);
  },
  delete: async (id: string): Promise<boolean> => {
    const existingPost = await postsRepository.getById(id);
    if (!existingPost || existingPost.isDeleted) {
      throw new Error("Пост не знайдено");
    }
    return postsRepository.delete(id);
  },
};
