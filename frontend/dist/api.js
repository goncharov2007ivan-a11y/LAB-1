const BASE_URL = 'http://localhost:3000/api/v1';
async function request(path, options = {}) {
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
    let response;
    try {
        response = await fetch(url, { ...options, headers, signal: controller.signal });
        clearTimeout(timeout);
    }
    catch (e) {
        if (e.name === "AbortError") {
            throw new Error("Перевищено час очікування. Сервер не відповідає");
        }
        throw new Error("Помилка мережі або CORS: " + e.message);
    }
    if (response.status === 204) {
        return null;
    }
    const rawText = await response.text();
    if (!response.ok) {
        let errorData;
        try {
            errorData = JSON.parse(rawText);
        }
        catch {
            errorData = null;
        }
        if (response.status === 403)
            throw new Error("Немає прав для цієї дії");
        const errorMessage = errorData?.message || errorData?.title || `Помилка сервера: ${response.status}`;
        throw new Error(errorMessage);
    }
    if (!rawText)
        return null;
    try {
        return JSON.parse(rawText);
    }
    catch {
        return rawText;
    }
}
export const api = {
    getPosts: async (category, search, page = 1, limit = 10, sort = 'desc') => {
        const params = new URLSearchParams();
        if (category)
            params.append("category", category);
        if (search)
            params.append("search", search);
        params.append("offset", String((page - 1) * limit));
        params.append("limit", String(limit));
        params.append("sort", sort);
        const url = `/posts?${params.toString()}`;
        const data = await request(url);
        return data.items;
    },
    getPost: async (postId) => {
        return await request(`/posts/${postId}`);
    },
    createPost: async (postData) => {
        return await request(`/posts`, {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    },
    updatePost: async (postId, postData) => {
        return await request(`/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify(postData)
        });
    },
    deletePost: async (postId) => {
        return await request(`/posts/${postId}`, { method: 'DELETE' });
    },
    getComments: async (postId) => {
        return await request(`/comments/post/${postId}`);
    },
    createComment: async (postId, content) => {
        const userId = localStorage.getItem('currentUserId');
        if (!userId)
            throw new Error("Ви повинні увійти, щоб залишити коментар");
        return await request(`/comments`, {
            method: 'POST',
            body: JSON.stringify({ postId: postId, authorId: userId, text: content })
        });
    },
    updateComment: async (commentId, text) => {
        return await request(`/comments/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify({ text })
        });
    },
    deleteComment: async (commentId) => {
        return await request(`/comments/${commentId}`, { method: 'DELETE' });
    },
    getUsers: async () => {
        return await request('/users', { method: 'GET' });
    },
    getUserById: async (userId) => {
        return await request(`/users/${userId}`, { method: 'GET' });
    },
    createUser: async (userData) => {
        return await request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    updateUser: async (userId, userData) => {
        return await request(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    },
};
