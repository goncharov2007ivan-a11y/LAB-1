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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        let response;
        try {
            response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw new Error("Перевищено час очікування. Сервер не відповідає");
            }
            throw new Error("Сервер наївся і спить. Перевірте з'єднання або спробуйте пізніше.");
        }
        if (!response.ok) throw new Error("Помилка сервера: не вдалося завантажити оголошення");
        
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
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Помилка: ${response.status}`);
            }
            
            const data = await response.json();
            
            return data;
        } catch (error) {
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