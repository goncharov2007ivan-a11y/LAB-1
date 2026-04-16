import { showView } from './app.js';
import { handleAuth, initAuth } from './components/auth.js';
import { handleCreatePostSubmit } from './views/createForm.js';
document.addEventListener('click', (event) => {
    const target = event.target;
    const categoryItem = target.closest('.category-menu li');
    if (categoryItem) {
        document.querySelectorAll('.category-menu li').forEach(li => li.classList.remove('active'));
        categoryItem.classList.add('active');
        const category = categoryItem.dataset.category;
        console.log('Обрано категорію:', category);
        return;
    }
    const createBtn = target.closest('#create-post-btn');
    if (createBtn) {
        showView('Form');
        return;
    }
    if (target.closest('#back-to-list-btn')) {
        console.log('Idi ff');
        showView('List');
    }
    const deleteBtn = target.closest('.delete-btn');
    if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        const postId = row?.dataset.id;
        console.log('Видаляємо пост:', postId);
        return;
    }
    if (target.closest('#auth-btn')) {
        handleAuth();
        return;
    }
});
showView('List');
initAuth();
document.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.id === 'create-post-form') {
        handleCreatePostSubmit(target);
    }
});
console.log("Додаток ініціалізовано! Чекаємо на події...");
