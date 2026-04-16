
import { state } from '../state.js';
import type { CreatePostDto } from '../dto/posts.dto.js';
import { showView } from '../app.js';

export function handleCreatePostSubmit(formElement: HTMLFormElement) {
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

    console.log("Готово до відправки на сервер:", newPostData);
    alert("Пост успішно створено! (Поки що тільки в консолі)");
    formElement.reset(); 
    showView('List');    
}