import { state } from '../state.js';
import { showView } from '../app.js';
import { api } from '../api.js';
import { showNotice } from '../ui.js';
import { loadPosts } from './postsList.js';
export async function handleCreatePostSubmit(formElement) {
    if (!state.currentUserId) {
        alert("Помилка: Спочатку увійдіть в систему (кнопка в правому верхньому куті)!");
        return;
    }
    const formData = new FormData(formElement);
    const newPostData = {
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        authorId: state.currentUserId
    };
    try {
        await api.createPost(newPostData);
        showNotice("Пост успішно створено!");
        formElement.reset();
        showView('List');
        await loadPosts();
    }
    catch (error) {
        showNotice("Помилка, не вдалося створити пост", true);
        console.error(error);
    }
}
