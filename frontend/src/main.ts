import { showView } from './app.js';
import { handleAuth, initAuth } from './auth.js';
import { handleCreatePostSubmit, initEditPostForm, resetPostFormToCreate } from './views/createForm.js';
import { loadPosts } from './views/postsList.js';
import { state } from './state.js';
import { authBtn, backToListBtn, categoryList, createPostBtn, createPostForm, searchInput } from './dom.js';
import { api } from './api.js';
import { loadComments, loadPostDetails } from './views/postDetail.js';
import { showNotice } from './ui.js';

showView('List');
initAuth();

categoryList?.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    
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
    const target = event.target as HTMLInputElement;
    state.filters.search = target.value.trim();

    state.filters.page = 1; 
    await loadPosts();
});
document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    
    if (target.closest('#create-post-btn')) {
        resetPostFormToCreate();
        showView('Form');
        return;
    }
    
    if(target.closest('#back-to-list-btn') || target.closest('#back-from-detail-btn')) {
        showView('List');
        return;
    }

    if (target.closest('#auth-btn')) {
        handleAuth();
        return;
    }

    const deletePostBtn = target.closest('#delete-post-btn') as HTMLElement;
    if (deletePostBtn) {
        const postId = deletePostBtn.dataset.postId;
        if (!postId) return;
        
        if (confirm('Ви дійсно хочете видалити цей пост?')) {
            try {
                await api.deletePost(postId);
                showView('List'); 
                await loadPosts();
            } catch (error) {
                showNotice("Не вдалося видалити пост", true);
            }
        }
        return;
    }
     
    const editPostBtn = target.closest('#edit-post-btn') as HTMLElement;
    if (editPostBtn) {
        const postId = editPostBtn.dataset.postId;
        if (postId) await initEditPostForm(postId);
        return;
    }

    const deleteCommentBtn = target.closest('.delete-comment-btn') as HTMLElement;
    if (deleteCommentBtn) {
        const commentId = deleteCommentBtn.dataset.commentId;
        const postIdInput = document.getElementById('comment-post-id') as HTMLInputElement;
        
        if (!commentId || !postIdInput) return;

        if (confirm('Ви дійсно хочете видалити цей коментар?')) {
            try {
                await api.deleteComment(commentId);
                await loadComments(postIdInput.value);
            } catch (error) {
                showNotice("Не вдалося видалити коментар", true);
            }
        }
        return;
    }

    const editCommentBtn = target.closest('.edit-comment-btn') as HTMLElement;
    if (editCommentBtn) {
        const commentId = editCommentBtn.dataset.commentId;
        const currentText = editCommentBtn.dataset.currentText;
        
        const form = document.getElementById('add-comment-form') as HTMLFormElement;
        const textInput = document.getElementById('comment-text') as HTMLTextAreaElement;
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (commentId && currentText && form && textInput) {
            textInput.value = currentText; 
            form.dataset.editCommentId = commentId; 
            submitBtn.textContent = 'Зберегти коментар';
            textInput.focus();
        }
        return;
    }
    
    const viewBtn = target.closest('[data-view-id]') as HTMLElement;
    if (viewBtn) {
        const postId = viewBtn.dataset.viewId;
        if (postId) {
            await loadPostDetails(postId);
        }
        return;
    }
    const sortDateHeader = target.closest('#sort-date-th') as HTMLElement;
    if (sortDateHeader) {
        const sortArrow = sortDateHeader.querySelector('#sort-arrow') as HTMLSpanElement;
        
        if (state.filters.sortOrder === 'desc') {
            state.filters.sortOrder = 'asc';
            if (sortArrow) sortArrow.textContent = '▲'; 
        } 
        else {
            state.filters.sortOrder = 'desc';
            if (sortArrow) sortArrow.textContent = '▼';
        }

        state.filters.page = 1;
        
        await loadPosts();
        return;
    }
});
document.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const target = event.target as HTMLFormElement;
    if (target.id === 'create-post-form') {
        handleCreatePostSubmit(target);
        return;
    }
    if (target.id === 'add-comment-form') {
        const postIdInput = target.querySelector('#comment-post-id') as HTMLInputElement;
        const textInput = target.querySelector('#comment-text') as HTMLTextAreaElement;
        const submitBtn = target.querySelector('button[type="submit"]') as HTMLButtonElement;

        const postId = postIdInput?.value;
        const text = textInput?.value.trim();
        const editCommentId = target.dataset.editCommentId;

        if (!postId || !text) return;

        try {
            submitBtn.disabled = true;

            if (editCommentId) {
                submitBtn.textContent = 'Збереження...';
                await api.updateComment(editCommentId, text);
                delete target.dataset.editCommentId; 
            } else {
                submitBtn.textContent = 'Відправка...';
                await api.createComment(postId, text);
            }
            
            textInput.value = '';
            submitBtn.textContent = 'Відправити коментар';
            await loadComments(postId); 

        } catch (error) {
            console.error(error);
            showNotice("Не вдалося додати коментар", true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = editCommentId ? 'Зберегти коментар' : 'Відправити коментар';
        }
    }
});

console.log("Додаток ініціалізовано! Чекаємо на події...");

await loadPosts();