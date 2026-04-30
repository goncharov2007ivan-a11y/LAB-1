import { showView } from './app.js';
import { handleAuth, initAuth } from './components/auth.js';
import { handleCreatePostSubmit } from './views/createForm.js';
import { loadPosts } from './views/postsList.js';
import { state } from './state.js';

showView('List');
await loadPosts();

document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    const categoryList = document.getElementById('category-list');
categoryList?.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'LI' || target.classList.contains('category-item')) {
        const selectedCategory = target.dataset.category || target.textContent || "";
        
        state.filters.category = selectedCategory === "Всі категорії" ? "": selectedCategory;
        
        categoryList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        target.classList.add('active');
        
        await loadPosts();
    }
});

    const createBtn = target.closest('#create-post-btn');
    if (createBtn) {
        showView('Form');
        return;
    }
    if(target.closest('#back-to-list-btn')) {
        showView('List');
    }

    const deleteBtn = target.closest('.delete-btn') as HTMLElement;
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
    const target = event.target as HTMLFormElement;

    if (target.id === 'create-post-form') {
        handleCreatePostSubmit(target);
    }
});

console.log("Додаток ініціалізовано! Чекаємо на події...");