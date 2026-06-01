
import { CommentViewDto } from "../../shared/dtos/comments.dto";
import { CreatePostDto, ListResponse, PostViewDto, UpdatePostDto } from "../../shared/dtos/posts.dto";
import { CreateUserDto, UserViewDto, UpdateUserDto, LoginUserDto } from "../../shared/dtos/users.dto";

const BASE_URL = 'http://localhost:3000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T | null> {
    const url = `${BASE_URL}${path}`;

    const token = localStorage.getItem('token');

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && options.method !== 'GET' && options.method !== 'DELETE') {
        headers.set('Content-Type', 'application/json');
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
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

        const errorMessage = errorData?.message || errorData?.error || errorData?.title;

        if (response.status === 401) {
            throw new Error(errorMessage || "Необхідна авторизація. Увійдіть у систему.");
        }
        
        if (response.status === 403) {
            throw new Error(errorMessage || "Немає прав для цієї дії");
        }
        
        throw new Error(errorMessage || `Помилка сервера: ${response.status}`);
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
        const data = await request<ListResponse<PostViewDto>>(url);
        return data?.items; 
    },
    
    getPost: async (postId: string) => {
        return await request<PostViewDto>(`/posts/${postId}`);
    },

    createPost: async (postData: CreatePostDto) => {
        return await request<PostViewDto>(`/posts`, {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    },

    updatePost: async (postId: string, postData: UpdatePostDto) => {
        return await request<PostViewDto>(`/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify(postData)
        });
    },

    deletePost: async (postId: string) => {
        return await request<boolean>(`/posts/${postId}`, { method: 'DELETE' });
    },

    getComments: async (postId: string) => {
        return await request<CommentViewDto[]>(`/comments/post/${postId}`);
    },

    createComment: async (postId: string, content: string) => {
        const userStr = localStorage.getItem('currentUser'); 
        if (!userStr) throw new Error("Ви повинні увійти, щоб залишити коментар");
        const user = JSON.parse(userStr);

        return await request<CommentViewDto>(`/comments`, {
            method: 'POST',
            body: JSON.stringify({ postId: postId, authorId: user.id, text: content })
        });
    },

    updateComment: async (commentId: string, text: string) => {
        return await request<CommentViewDto>(`/comments/${commentId}`, {
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

    loginUser: async (loginData: LoginUserDto) => {
        const data = await request<{ token: string, user: UserViewDto }>('/users/login', { 
            method: 'POST',
            body: JSON.stringify(loginData)
        });
        
        if (!data) throw new Error("Помилка авторизації");
        return data;
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
    deleteUser: async (userId: string) => {
        return await request<boolean>(`/users/${userId}`, {
            method: 'DELETE'
        })
    },
};