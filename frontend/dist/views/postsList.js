import { api } from "../api.js";
import * as DOM from '../dom.js';
import { state } from '../state.js';
function renderListStatus(status, errorMessage) {
    if (status === 'loading') {
        DOM.postsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Завантаження...</td></tr>';
    }
    else if (status === 'empty') {
        DOM.postsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Оголошень поки немає</td></tr>';
    }
    else if (status === 'error') {
        DOM.postsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Помилка: ${errorMessage}</td></tr>`;
    }
    else {
        DOM.postsBody.innerHTML = '';
    }
}
export async function loadPosts() {
    renderListStatus('loading');
    try {
        const posts = await api.getPosts();
        if (!posts || posts.length === 0) {
            renderListStatus('empty');
            return;
        }
        renderListStatus('success');
        posts.forEach((post) => {
            const tr = document.createElement('tr');
            const titleTd = document.createElement('td');
            titleTd.textContent = post.title;
            const categoryTd = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = post.category;
            categoryTd.appendChild(badge);
            const contentTd = document.createElement('td');
            contentTd.textContent = post.content;
            const authorTd = document.createElement('td');
            authorTd.textContent = post.author;
            const dateTd = document.createElement('td');
            dateTd.textContent = new Date(post.date).toLocaleDateString('uk-UA');
            const actionsTd = document.createElement('td');
            const isMyPost = post.authorId === state.currentUserId;
            actionsTd.innerHTML = `
                <button type="button" class="btn outline small" data-view-id="${post.id}">Деталі</button>
                ${isMyPost ? `<button type="button" class="btn delete small" data-delete-id="${post.id}">Видалити</button>` : ''}
            `;
            tr.append(titleTd, categoryTd, contentTd, authorTd, dateTd, actionsTd);
            DOM.postsBody.appendChild(tr);
        });
    }
    catch (error) {
        console.error(error);
        renderListStatus('error', error.message || 'Не вдалося завантажити дані з сервера');
    }
}
