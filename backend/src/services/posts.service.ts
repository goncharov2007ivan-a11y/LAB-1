import { postsRepository } from "../repositories/posts.repository.js";
import type {
  CreatePostDto,
  UpdatePostDto,
  PostViewDto,
  ListResponse,
  Post,
} from "../dtos/posts.dto.js";

export interface ListPostOptions {
  limit: number;
  offset: number;
  category?: string;
  search?: string;
  dateSort?: string;
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
  list: async (options: ListPostOptions,): Promise<ListResponse<PostViewDto>> => {
    const { items, total } = await postsRepository.getFiltered(options);
    return {
      items: items.map(toPostViewDto),
      total,
      limit: options.limit,
      offset: options.offset,
    };
  },
  getById: async (id: string): Promise<PostViewDto> => {
    const post = await postsRepository.getById(id);
    
    if (!post || post.isDeleted) {
      throw new Error("Пост не знайдено");
    }
    
    return toPostViewDto(post);
  },
  create: async (dto: any): Promise<PostViewDto> => {
    const newPost = {
      title: dto.title,
      category: dto.category,
      content: dto.content,
      date: new Date().toISOString(),
      authorId: dto.authorID
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
