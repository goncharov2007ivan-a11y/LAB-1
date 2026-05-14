import { api } from "../api.js";
import { showView } from "../app.js";
import { viewPost } from "../dom.js";

export async function loadPostDetails(postId: string) {
    try {
        showView('Post');

        viewPost.innerHTML = `
            <div class="panel">
                <p>Завантаження...</p>
            </div>
        `;

        const post = await api.getPost(postId);
        const currentUserId = localStorage.getItem('currentUserId');
        const isMyPost = currentUserId && String(currentUserId) === String(post.authorId);

        viewPost.innerHTML = `
            <div class="toolbar">
            <h2>Деталі оголошення</h2>
                <button type="button" id="back-from-detail-btn" class="btn outline">Назад</button>
                ${isMyPost ? `
                        <button type="button" id="edit-post-btn" data-post-id="${post.id}" class="btn outline">Редагувати</button>
                        <button type="button" id="delete-post-btn" data-post-id="${post.id}" class="btn delete">Видалити</button>
                ` : ''}
            </div>

            <div class="panel">
                <h3>${post.title}</h3>

                <div class="post-meta">
                    <span class="badge">${post.category}</span>
                    <span class="post-author">Автор: ${post.author}</span>
                    <span class="post-date">Дата: ${new Date(post.date).toLocaleDateString('uk-UA')}</span>
                </div>

                <div class="post-content">
                    ${post.content}
                </div>

            <div class="panel">
                <h3>Коментарі</h3>
                <form id="add-comment-form">
                    <input type="hidden" id="comment-post-id" value="${post.id}">
                    <div class="field">
                        <textarea id="comment-text" rows="3" required placeholder="Напишіть коментар..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn primary">Відправити коментар</button>
                    </div>
                </form>

                <div id="comments-list">
                    <p>Завантаження коментарів...</p>
                </div>
            </div>
        `;
        await loadComments(postId);
} catch (error) {
    console.error(error);
        viewPost.innerHTML = `
            <div class="toolbar">
                <h2>Помилка</h2>
                <button type="button" id="back-from-detail-btn" class="btn outline">Назад до списку</button>
            </div>
            <div class="panel">
                <p>Не вдалося завантажити пост. Можливо, його було видалено.</p>
            </div>
        `;
}
}

export async function loadComments(postId: string) {
    const commentsList = document.getElementById('comments-list');
    
    if (!commentsList) {
        console.log("[UI] Блок comments-list не знайдено на сторінці!");
        return;
    }

    try {
        const comments = await api.getComments(postId);
        const currentUserId = String(localStorage.getItem('currentUserId')); 
        
        if (!comments || comments.length === 0) {
            commentsList.innerHTML = '<p class="empty-msg">Поки немає коментарів.</p>';
            return;
        }

        commentsList.innerHTML = comments.map((c: any) => {
            const isMyComment = currentUserId && String(currentUserId) === String(c.authorId);

            return `
            <div class="comment-item">
                <div class="comment-header">
                    <strong class="comment-author">${c.author}</strong> 
                    <span class="comment-date">${new Date(c.date).toLocaleString('uk-UA')}</span>
                    ${isMyComment ? `
                            <button type="button" class="btn outline edit-comment-btn" data-comment-id="${c.id}" data-current-text="${c.text}">Редагувати</button>
                            <button type="button" class="btn outline delete-comment-btn" data-comment-id="${c.id}">Видалити</button>
                    ` : ''}
                </div>
                <div class="comment-body">
                    ${c.text}
                </div>
            </div>
            `;
        }).join('');
    } catch (error) {
        console.error(error);
        commentsList.innerHTML = '<p class="error-msg">Не вдалося завантажити коментарі.</p>';
    }
}