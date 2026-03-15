export interface Post {
    id: string;
    title: string;
    category: string;
    content: string;
    author: string;
    date: string;
    isDeleted: boolean;
}
export interface CreatePostDto {
    title: string;
    category: string;
    content: string;
    author: string;
}
export interface UpdatePostDto {
    title?: string;
    category?: string;
    content?: string;
    author?: string;
}