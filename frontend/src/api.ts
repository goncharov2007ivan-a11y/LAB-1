
import { CreatePostDto, UpdatePostDto } from "../../shared/dtos/posts.dto";
import { CreateUserDto, UserViewDto, UpdateUserDto } from "../../shared/dtos/users.dto";

const BASE_URL = 'http://localhost:3000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T | null> {
    const url = `${BASE_URL}${path}`;
    const userId = localStorage.getItem('currentUserId') || '';

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && options.method !== 'GET' && options.method !== 'DELETE') {
        headers.set('Content-Type', 'application/json');
    }
    if (userId) {
        headers.set('User-Id', userId);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
        response = await fetch(url, { ...options, headers, signal: controller.signal });
        clearTimeout(timeout);
    } catch (e: any) {
        if (e.name === "AbortError") {
            throw new Error("Перевищено час очікування. Сервер не відповідає");
        }
        throw new Error("Помилка мережі або CORS: " + e.message);
    }

    if (response.status === 204) {
        return null as T;
    }

    const rawText = await response.text();

    if (!response.ok) {
        let errorData;
        try { errorData = JSON.parse(rawText); } 
        catch { errorData = null; }
        
        if (response.status === 403) throw new Error("Немає прав для цієї дії");
        
        const errorMessage = errorData?.message || errorData?.title || `Помилка сервера: ${response.status}`;
        throw new Error(errorMessage);
    }

    if (!rawText) return null;
    try {
        return JSON.parse(rawText);
    } catch {
        return rawText as T;
    }
}

export const api = {
    getPosts: async (category?: string, search?: string, page: number = 1, limit: number = 10, sort: string = 'desc') => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        params.append("offset", String((page - 1) * limit));
        params.append("limit", String(limit));
        params.append("sort", sort);

        const url = `/posts?${params.toString()}`;
        const data = await request<any>(url);
        return data.items; 
    },
    
    getPost: async (postId: string) => {
        return await request<any>(`/posts/${postId}`);
    },

    createPost: async (postData: CreatePostDto) => {
        return await request<any>(`/posts`, {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    },

    updatePost: async (postId: string, postData: UpdatePostDto) => {
        return await request<any>(`/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify(postData)
        });
    },

    deletePost: async (postId: string) => {
        return await request<boolean>(`/posts/${postId}`, { method: 'DELETE' });
    },

    getComments: async (postId: string) => {
        return await request<any>(`/comments/post/${postId}`);
    },

    createComment: async (postId: string, content: string) => {
        const userId = localStorage.getItem('currentUserId'); 
        if (!userId) throw new Error("Ви повинні увійти, щоб залишити коментар");

        return await request<any>(`/comments`, {
            method: 'POST',
            body: JSON.stringify({ postId: postId, authorId: userId, text: content })
        });
    },

    updateComment: async (commentId: string, text: string) => {
        return await request<any>(`/comments/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify({ text })
        });
    },

    deleteComment: async (commentId: string) => {
        return await request<boolean>(`/comments/${commentId}`, { method: 'DELETE' });
    },
    getUsers: async () => {
        return await request<UserViewDto[]>('/users', { method: 'GET' });
    },

    getUserById: async (userId: string) => {
        return await request<UserViewDto>(`/users/${userId}`, { method: 'GET' });
    },

    loginUser: async (email: string) => {
        const users = await request<UserViewDto[]>('/users', { method: 'GET' });
        
        if (!users || !Array.isArray(users)) {
            throw new Error("Помилка отримання даних з сервера");
        }
        
        const user = users.find(u => u.email === email);
        
        if (!user) {
            throw new Error("Користувача з таким email не знайдено");
        }
        
        return user;
    },

    createUser: async (userData: CreateUserDto) => {
        return await request<UserViewDto>('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    updateUser: async (userId: string, userData: UpdateUserDto) => {
        return await request<UserViewDto>(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    },
};