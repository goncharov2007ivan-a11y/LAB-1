import { CreatePostDto } from "./dto/posts.dto";

const BASE_URL = 'http://localhost:3000/api/v1';
export const api = {
    getUsers: async () => {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) throw new Error("Помилка сервера");
        return response.json();
    },
    getPosts: async () => {
        const response = await fetch(`${BASE_URL}/posts`);
        if (!response.ok) throw new Error("Помилка сервера");
        const result = await response.json();
        return result.items;
    },
    createPost: async (postData: CreatePostDto) => {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error("Помилка створення поста");
        return response.json();
    },
    deletePost: async (postId: string | number) => {
        const response = await fetch(`${BASE_URL}/posts/${postId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Не вдалося видалити пост");
        return true; 
    }
}