
import { state } from '../state.js';
import type { CreatePostDto } from '../dto/posts.dto.js';
import { showView } from '../app.js';
import { api } from '../api.js';
import { showNotice } from '../ui.js';
import { loadPosts } from './postsList.js';

export async function handleCreatePostSubmit(formElement: HTMLFormElement) {
    if (!state.currentUserId) {
        alert("Помилка: Спочатку увійдіть в систему (кнопка в правому верхньому куті)!");
        return;
    }

    const formData = new FormData(formElement);

    const newPostData: CreatePostDto = {
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        content: formData.get('content') as string,
        authorId: state.currentUserId
    };
    try {
        await api.createPost(newPostData);
        showNotice("Пост успішно створено!");
        formElement.reset();
        showView('List');
        await loadPosts();
    } catch(error) {
        showNotice("Помилка, не вдалося створити пост", true)
        console.error(error);
    }
       
}