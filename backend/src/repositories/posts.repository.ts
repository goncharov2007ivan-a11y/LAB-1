import type { Post, CreatePostDto, UpdatePostDto} from "../dtos/posts.dto.js";
import {randomUUID} from "node:crypto";

let posts: Post[] = [];
export const postsRepository = {
  getAll: ():  Post[] => {
    return posts;
  },
  getById: (id: string): Post | undefined => {
    return posts.find((post) => post.id === id);
  },
  create: (dto: CreatePostDto): Post => {
        const newPost: Post = {
            id: randomUUID(),
            ...dto,
            date: new Date().toISOString(),
            isDeleted: false
        };
        posts.push(newPost);
        return newPost;
    },
    update: (id: string, updatedFields: UpdatePostDto): Post | null => {
        const index = posts.findIndex((post) => post.id === id);
        if (index === -1) return null;
        posts[index] = { ...posts[index], ...updatedFields } as Post;
        return posts[index];
    },
    delete: (id: string): boolean => {
        const index = posts.findIndex((post) => post.id === id);
        if (index === -1) return false;

        posts[index]!.isDeleted = true;
        return true;
    }
};
