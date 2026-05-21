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
                <div class="toolbar-actions" id="toolbar-actions">
                    <button type="button" id="back-from-detail-btn" class="btn outline">Назад</button>
                    </div>
            </div>

            <div class="panel">
                <h3 id="post-title"></h3>

                <div class="post-meta">
                    <span class="badge" id="post-category"></span>
                    <span class="post-author" id="post-author"></span>
                    <span class="post-date" id="post-date"></span>
                </div>

                <div class="post-content" id="post-content"></div>
            </div>

            <div class="panel">
                <h3>Коментарі</h3>
                <div id="comments-list">
                    <p>Завантаження коментарів...</p>
                </div>
            </div>
        `;

        document.getElementById('post-title')!.textContent = post.title;
        document.getElementById('post-category')!.textContent = post.category;
        document.getElementById('post-author')!.textContent = `Автор: ${post.author}`;
        document.getElementById('post-date')!.textContent = `Дата: ${new Date(post.date).toLocaleDateString('uk-UA')}`;
        document.getElementById('post-content')!.textContent = post.content;

        if (isMyPost) {
            const actionsContainer = document.getElementById('toolbar-actions');

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.id = 'edit-post-btn';
            editBtn.className = 'btn outline';
            editBtn.textContent = 'Редагувати';
            editBtn.dataset.postId = post.id;

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.id = 'delete-post-btn';
            deleteBtn.className = 'btn delete';
            deleteBtn.textContent = 'Видалити';
            deleteBtn.dataset.postId = post.id;

            actionsContainer?.appendChild(editBtn);
            actionsContainer?.appendChild(deleteBtn);
        }

        await loadComments(postId);
    } catch (error) {
        console.error(error);
        viewPost.innerHTML = `
            <div class="panel">
                <p class="error-text">Не вдалося завантажити деталі оголошення.</p>
            </div>
        `;
    }
}

export async function loadComments(postId: string) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    try {
        const comments = await api.getComments(postId);
        const currentUserId = localStorage.getItem('currentUserId'); 
        
        commentsList.innerHTML = '';

        if (!comments || comments.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-msg';
            emptyMsg.textContent = 'Поки немає коментарів.';
            commentsList.appendChild(emptyMsg);
            return;
        }

        comments.forEach((c: any) => {
            const isMyComment = currentUserId && String(currentUserId) === String(c.authorId);

            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';

            const commentHeader = document.createElement('div');
            commentHeader.className = 'comment-header';

            const authorNode = document.createElement('strong');
            authorNode.className = 'comment-author';
            authorNode.textContent = c.author;

            const dateNode = document.createElement('span');
            dateNode.className = 'comment-date';
            dateNode.textContent = new Date(c.date).toLocaleString('uk-UA');

            commentHeader.appendChild(authorNode);
            commentHeader.appendChild(dateNode);

            if (isMyComment) {
                const editCommentBtn = document.createElement('button');
                editCommentBtn.type = 'button';
                editCommentBtn.className = 'btn outline edit-comment-btn';
                editCommentBtn.textContent = 'Редагувати';
                editCommentBtn.dataset.commentId = c.id;
                editCommentBtn.dataset.currentText = c.text;

                const deleteCommentBtn = document.createElement('button');
                deleteCommentBtn.type = 'button';
                deleteCommentBtn.className = 'btn outline delete-comment-btn';
                deleteCommentBtn.textContent = 'Видалити';
                deleteCommentBtn.dataset.commentId = c.id;

                commentHeader.appendChild(editCommentBtn);
                commentHeader.appendChild(deleteCommentBtn);
            }

            const commentBody = document.createElement('div');
            commentBody.className = 'comment-body';
            commentBody.textContent = c.text;

            commentItem.appendChild(commentHeader);
            commentItem.appendChild(commentBody);
            
            commentsList.appendChild(commentItem);
        });

    } catch (error) {
        console.error(error);
        commentsList.innerHTML = '<p class="error-text">Не вдалося завантажити коментарі.</p>';
    }
}