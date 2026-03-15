import type { Post } from '../dtos/posts.dto.js';
let posts: Post[] = [];
export const postsRepository = {
    getAll: (): Post[] => {
        return posts.filter(post => !post.isDeleted);
    },

getByID: (id: string): Post | undefined => {
    return posts.find(post => post.id === id && !post.isDeleted);
},

create: (post: Post): Post => {
    posts.push(post);
    return post;
},

update: (id: string, updatedFields: Partial<Post>) : Post | null => {
    const index = posts.findIndex(post => post.id === id && !post.isDeleted);
    if (index === -1 ) return null;
    posts[index] = {...posts[index], ...updatedFields } as Post;
    return posts[index];
},

delete: (id:string): boolean => {
    const index = posts.findIndex(post => post.id === id && !post.isDeleted);
    if (index === -1) return false;
    (posts[index] as Post).isDeleted = true;
    return true;
}
}

