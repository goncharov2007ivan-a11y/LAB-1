import type { Post } from "../dtos/posts.dto.js";


let posts: Post[] = [];
export const postsRepository = {
  getAll: async ():  Promise<Post[]> => {
    return posts;
  },
  getById: async (id: string): Promise<Post | undefined> => {
    return posts.find((post) => post.id === id);
  },
  create: async (post: Post): Promise<Post> => {
        posts.push(post);
        return post;
    },
    update: async (id: string, updatedFields: Partial<Post>): Promise<Post | null> => {
        const index = posts.findIndex((post) => post.id === id);
        if (index === -1) return null;
        posts[index] = { ...posts[index], ...updatedFields } as Post;
        return posts[index];
    },
    delete: async (id: string): Promise<boolean> => {
        const index = posts.findIndex((post) => post.id === id);
        if (index === -1) return false;

        posts[index]!.isDeleted = true;
        return true;
    }
};
