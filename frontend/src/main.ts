import { showView } from './app.js';
import { initAuth } from './auth.js';
import { handleCreatePostSubmit, initEditPostForm, resetPostFormToCreate } from './views/createForm.js';
import { loadPosts } from './views/postsList.js';
import { state } from './state.js';
import { categoryList, searchInput } from './dom.js';
import { api } from './api.js';
import { loadComments, loadPostDetails } from './views/postDetail.js';
import { clearError, showError, showNotice } from './ui.js';
import { closeUserModal, handleUserRegistration, openUserModal } from './views/userModal.js';
import { openProfileModal, closeProfileModal } from './views/profileModal.js';
import { UpdateUserSchema } from '../../shared/dtos/users.dto.js';

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

    if (target.closest('#auth-btn')) return openUserModal();

    if (target.closest('#close-user-modal-btn') || target.classList.contains('modal-overlay')) {
        return closeUserModal();
    }

    if (target.closest('#profile-logout-btn')) {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserName');
        state.currentUserId = null;
        
        window.location.reload(); 
        return;
    }

    if (target.closest('#profile-delete-btn')) {
        const currentUserId = localStorage.getItem('currentUserId');
        if (!currentUserId) return;

        if (confirm('Ви дійсно хочете видалити свій профіль? Усі ваші дані будуть втрачені безповоротно.')) {
            try {

                await api.deleteUser(currentUserId);
                
                localStorage.removeItem('currentUserId');
                localStorage.removeItem('currentUserName');
                state.currentUserId = null;
                
                showNotice("Ваш профіль успішно видалено.");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (error) {
                console.error(error);
                showNotice("Не вдалося видалити профіль.", true);
            }
        }
        return;
    }
    
    if (target.closest('#create-post-btn')) {
        resetPostFormToCreate();
        showView('Form');
        return;
    }
    
    if(target.closest('#back-to-list-btn') || target.closest('#back-from-detail-btn')) {
        showView('List');
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
                showNotice("Коментар видалено!");
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
    if (target.closest('#open-profile-btn')) {

        await openProfileModal();
        return;
    }
    if (target.closest('#close-profile-btn') || target === document.getElementById('profile-modal-overlay')) {
        closeProfileModal();
        return;
    }
});
document.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const target = event.target as HTMLFormElement;

    if (target.id === 'create-user-form') return handleUserRegistration();

    if (target.id === 'create-post-form') {
        handleCreatePostSubmit(target);
        return;
    }
    if (target.id === 'add-comment-form') {
        const postIdInput = target.querySelector('#comment-post-id') as HTMLInputElement;
        const textInput = target.querySelector('#comment-text') as HTMLTextAreaElement;
        const submitBtn = target.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorDiv = target.querySelector('#commentError') as HTMLDivElement;

        const postId = postIdInput?.value || '';
        const text = textInput?.value.trim() || '';
        const editCommentId = target.dataset.editCommentId;

        let isValid = true;

        if (textInput && errorDiv) {
        clearError(textInput, errorDiv);

        if (!text) {
            showError(textInput, errorDiv, 'Текст коментаря не може бути порожнім.');
            isValid = false;
        } else if (text.length < 3) {
            showError(textInput, errorDiv, 'Коментар має містити мінімум 3 символи.');
            isValid = false;
        }
    }

        if (!postId || !isValid) return;

        try {
            submitBtn.disabled = true;

            if (editCommentId) {
                submitBtn.textContent = 'Збереження...';
                await api.updateComment(editCommentId, text as string);
                showNotice("Коментар успішно оновлено!");
                delete target.dataset.editCommentId; 
            } else {
                submitBtn.textContent = 'Відправка...';
                await api.createComment(postId, text as string);
                showNotice("Коментар успішно додано!");
            }
            
            textInput.value = '';
            submitBtn.textContent = 'Відправити коментар';
            await loadComments(postId); 

        } catch (error) {
            console.error(error);
            const errorMsg = error instanceof Error ? error.message : "Не вдалося додати коментар";
            showNotice(errorMsg, true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = editCommentId ? 'Зберегти коментар' : 'Відправити коментар';
        }
    }
    if (target.id === 'edit-profile-form') {
        const currentUserId = localStorage.getItem('currentUserId');
        if (!currentUserId) return;

        const nameInput = target.querySelector('#profile-name') as HTMLInputElement;
        const emailInput = target.querySelector('#profile-email') as HTMLInputElement;
        const nameError = target.querySelector('#profileNameError') as HTMLDivElement;
        const emailError = target.querySelector('#profileEmailError') as HTMLDivElement;

        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();

        if (nameInput && nameError && emailInput && emailError) {
            clearError(nameInput, nameError);
            clearError(emailInput, emailError);
        }

        const validationResult = UpdateUserSchema.shape.body.safeParse({
            name: newName,
            email: newEmail
        });

        if (!validationResult.success) {
            validationResult.error.issues.forEach(issue => {
                const fieldName = issue.path[0]; 
                
                if (fieldName === 'name') {
                    showError(nameInput, nameError, issue.message);
                } else if (fieldName === 'email') {
                    showError(emailInput, emailError, issue.message);
                }
            });
            return; 
        }

        const submitBtn = target.querySelector('button[type="submit"]') as HTMLButtonElement;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Збереження...';

            await api.updateUser(currentUserId, { name: newName, email: newEmail });
            
            localStorage.setItem('currentUserName', newName);
            const userNameDisplay = document.getElementById('user-name-display');
            if (userNameDisplay) userNameDisplay.textContent = newName;

            showNotice("Профіль успішно оновлено!");
            closeProfileModal(); 
        } catch (error) {
            console.error(error);
            const errorMsg = error instanceof Error ? error.message : "Не вдалося оновити профіль";
            showNotice(errorMsg, true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Зберегти зміни';
        }
        return;
    }

});

console.log("Додаток ініціалізовано! Чекаємо на події...");

await loadPosts();