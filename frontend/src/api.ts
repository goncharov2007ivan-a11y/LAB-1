import { CreatePostDto } from "./dto/posts.dto";

const BASE_URL = 'http://localhost:3000/api/v1';
export const api = {
    getUsers: async () => {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) throw new Error("Помилка сервера");
        return response.json();
    },
    getPosts: async (category?: string, search?: string, page: number = 1, limit: number = 10) => {
        let url = `${BASE_URL}/posts`;

        const params: string[] = [];
        if (category) {
            params.push("category=" + encodeURIComponent(category));
        }
        if (search) {
            params.push("search=" + encodeURIComponent(search));
        }

        const offset = (page - 1) * limit;
        params.push("offset=" + offset);
        params.push("limit=" + limit);

        if (params.length > 0) {
            url += "?" + params.join("&");
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Помилка сервера");
        const result = await response.json();
        return result.items;
    },
    createPost: async (postData: CreatePostDto) => {
        const url = 'http://localhost:3000/api/v1/posts';
        const userId = localStorage.getItem('currentUserId') || '';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'user-id': userId
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error("Помилка створення поста");
        return response.json();
    },
    deletePost: async (postId: string) => {
        const url = `http://localhost:3000/api/v1/posts/${postId}`;

        const userId = localStorage.getItem('currentUserId') || '';
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'User-id': userId, 
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 403) {
            throw new Error("У вас немає прав для видалення цього поста.");
        }
        
        if (!response.ok) {
            throw new Error("Помилка при видаленні поста");
        }
        
        return true; 
    },
    getPost: async (postId: string) => {
        const url = `http://localhost:3000/api/v1/posts/${postId}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Не вдалося завантажити деталі поста");
        }
        return await response.json();
    },
    getComments: async (postId: string) => {
        const url = `http://localhost:3000/api/v1/comments/post/${postId}`;
        console.log(`[API] 1. Відправляємо GET запит на: ${url}`);
        
        try {
            const response = await fetch(url);
            console.log(`[API] 2. Сервер відповів зі статусом: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`Помилка: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`[API] 3. Отримані дані від сервера:`, data);
            
            return data;
        } catch (error) {
            console.error(`[API] Помилка fetch:`, error);
            throw error;
        }
    },
    createComment: async (postId: string, content: string) => {
        const url = `http://localhost:3000/api/v1/comments`;
        const userId = localStorage.getItem('currentUserId'); 
        if (!userId) throw new Error("Ви повинні увійти, щоб залишити коментар");

        const castForBackend = {
            postId: Number(postId),
            authorId: Number(userId),
            text: content
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Id': userId 
            },
            body: JSON.stringify(castForBackend) 
        });
        
        if (!response.ok) throw new Error("Помилка створення коментаря");
        return await response.json();
    },
}