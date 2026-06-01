
import { state } from '../state.js';
import type { CreatePostDto, UpdatePostDto } from '../../../shared/dtos/posts.dto.js';
import { showView } from '../app.js';
import { api } from '../api.js';
import { showNotice, clearError, showError } from '../ui.js';
import { loadPosts } from './postsList.js';
import { categoryError, categoryInput, contentError, contentInput, createPostForm, titleError, titleInput } from '../dom.js';

export function clearAllPostFormErrors() {
    clearError(titleInput, titleError);
    clearError(categoryInput, categoryError);
    clearError(contentInput, contentError);
}

function validatePostForm(
    titleInput: HTMLInputElement, titleError: HTMLDivElement,
    categoryInput: HTMLSelectElement, categoryError: HTMLDivElement,
    contentInput: HTMLTextAreaElement, contentError: HTMLDivElement
): boolean {
    let isValid = true;
    clearError(titleInput, titleError);
    clearError(categoryInput, categoryError);
    clearError(contentInput, contentError);

    if (!titleInput.value.trim()) {
        showError(titleInput, titleError, "Заголовок є обов'язковим полем.");
        isValid = false;
    } else if (titleInput.value.trim().length < 5) {
        showError(titleInput, titleError, 'Заголовок має містити мінімум 5 символів.');
        isValid = false;
    }
    

    if (!categoryInput.value) {
        showError(categoryInput, categoryError, 'Будь ласка, оберіть категорію.');
        isValid = false;
    }
    if (!contentInput.value.trim()) {
        showError(contentInput, contentError, 'Текст оголошення не може бути порожнім.');
        isValid = false;
    } else if (contentInput.value.trim().length < 10) {
        showError(contentInput, contentError, 'Опишіть детальніше (мінімум 10 символів).');
        isValid = false;
    }
    return isValid;
}
export async function initEditPostForm(postId: string) {
    try {
        const post = await api.getPost(postId);
        
            if (!post) {
        throw new Error("Оголошення не знайдено");
    }

        titleInput.value = post.title;
        categoryInput.value = post.category;
        contentInput.value = post.content;

        createPostForm.dataset.editPostId = postId;
        const submitBtn = createPostForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitBtn) submitBtn.textContent = 'Зберегти пост';

        clearAllPostFormErrors();
        
        showView('Form');
    } catch (error) {
        showNotice("Не вдалося завантажити дані для редагування", true);
    }
}
export function resetPostFormToCreate() {
    createPostForm.reset();
    delete createPostForm.dataset.editPostId;
    const submitBtn = createPostForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) submitBtn.textContent = 'Опублікувати';
    clearAllPostFormErrors();
}
export async function handleCreatePostSubmit(formElement: HTMLFormElement) {

    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        showNotice("Спочатку увійдіть в систему!", true);
        return;
    }
    const currentUser = JSON.parse(userStr);
    
    const submitBtn = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn.disabled) return;
    submitBtn.disabled = true;

    const isFormValid = validatePostForm(
        titleInput, titleError, 
        categoryInput, categoryError, 
        contentInput, contentError
    );
    if (!isFormValid) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Опублікувати';
        return;
    }; 
    
    const formData = new FormData(formElement);

    const postData: CreatePostDto = {
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        content: formData.get('content') as string,
        authorId: String(currentUser.id) 
    };

    const editPostId = formElement.dataset.editPostId; 

    try {
        if (editPostId) {
            submitBtn.textContent = 'Збереження...';
            await api.updatePost(editPostId, postData as UpdatePostDto);
            showNotice("Пост успішно оновлено!");
        } else {
            submitBtn.textContent = 'Публікація...';
            await api.createPost(postData as CreatePostDto);
            showNotice("Пост успішно створено!");
        }

        resetPostFormToCreate(); 
        showView('List');
        await loadPosts();
        
    } catch(error: any) {
        showNotice(error.message || "Помилка, не вдалося створити пост", true);
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Опублікувати';
    }
}