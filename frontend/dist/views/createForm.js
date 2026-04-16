import { state } from '../state.js';
import { showView } from '../app.js';
export function handleCreatePostSubmit(formElement) {
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
    console.log("Готово до відправки на сервер:", newPostData);
    alert("Пост успішно створено! (Поки що тільки в консолі)");
    formElement.reset();
    showView('List');
}
