import { showView } from './app.js';
import { handleAuth, initAuth } from './auth.js';
import { handleCreatePostSubmit } from './views/createForm.js';
import { loadPosts } from './views/postsList.js';
import { state } from './state.js';
import { categoryList, searchInput } from './dom.js';
import { api } from './api.js';
import { loadComments, loadPostDetails } from './views/postDetail.js';
showView('List');
initAuth();
categoryList?.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.tagName === 'LI' || target.classList.contains('category-item')) {
        const selectedCategory = target.dataset.category || target.textContent || "";
        state.filters.category = selectedCategory === "Всі категорії" ? "" : selectedCategory;
        categoryList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        target.classList.add('active');
        state.filters.page = 1;
        await loadPosts();
    }
});
searchInput?.addEventListener('input', async (event) => {
    const target = event.target;
    state.filters.search = target.value.trim();
    state.filters.page = 1;
    await loadPosts();
});
document.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.closest('#create-post-btn')) {
        showView('Form');
        return;
    }
    if (target.closest('#back-to-list-btn') || target.closest('#back-from-detail-btn')) {
        showView('List');
        return;
    }
    if (target.closest('#auth-btn')) {
        handleAuth();
        return;
    }
    const deleteBtn = target.closest('[data-delete-id]');
    if (deleteBtn) {
        const postId = deleteBtn.dataset.deleteId;
        if (!postId)
            return;
        const isConfirmed = confirm('Ви дійсно хочете видалити цей пост?');
        if (isConfirmed) {
            try {
                await api.deletePost(postId);
                await loadPosts();
            }
            catch (error) {
                alert('Не вдалося видалити пост.');
            }
        }
        return;
    }
    const viewBtn = target.closest('[data-view-id]');
    if (viewBtn) {
        const postId = viewBtn.dataset.viewId;
        if (postId) {
            await loadPostDetails(postId);
        }
        return;
    }
});
document.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.id === 'create-post-form') {
        handleCreatePostSubmit(target);
        return;
    }
    if (target.id === 'add-comment-form') {
        const postIdInput = target.querySelector('#comment-post-id');
        const textInput = target.querySelector('#comment-text');
        const submitBtn = target.querySelector('button[type="submit"]');
        const postId = postIdInput?.value;
        const text = textInput?.value.trim();
        console.log("Спроба відправити коментар для поста:", postId);
        if (!postId || !text)
            return;
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Відправка...';
            await api.createComment(postId, text);
            console.log("Коментар успішно створено");
            textInput.value = '';
            await loadComments(postId);
        }
        catch (error) {
            console.error(error);
            alert('Не вдалося додати коментар.');
        }
        finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Відправити коментар';
        }
    }
});
console.log("Додаток ініціалізовано! Чекаємо на події...");
await loadPosts();
