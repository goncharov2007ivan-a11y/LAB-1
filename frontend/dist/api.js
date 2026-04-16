const BASE_URL = 'http://localhost:3000/api/v1';
export const api = {
    getUsers: async () => {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok)
            throw new Error("Помилка сервера");
        return response.json();
    },
    createPost: async (postData) => {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        if (!response.ok)
            throw new Error("Помилка створення поста");
        return response.json();
    }
};
