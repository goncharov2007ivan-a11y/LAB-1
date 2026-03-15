import { postsRepository } from '../repositories/posts.repository.js';
import type {Post, CreatePostDto, UpdatePostDto } from '../dtos/posts.dto.js';
import crypto from 'crypto';
export const postsService = {
getAll: (): Post[] => {
    return postsRepository.getAll();
},
getById: (id:string): Post | undefined => {
    return postsRepository.getByID(id);
},
create: (dto: CreatePostDto): Post => {
    const newPost: Post = {
        id: crypto.randomUUID(),
        title: dto.title,
        category: dto.category,
        content: dto.content,
        author: dto.author,
        date: new Date().toISOString(),
        isDeleted: false
    };
    return postsRepository.create(newPost);
},
update: (id: string, dto: UpdatePostDto): Post | null => {
        return postsRepository.update(id, dto);
    },
    delete: (id: string): boolean => {
        return postsRepository.delete(id);
    }
}