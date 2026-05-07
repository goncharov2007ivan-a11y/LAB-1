import { api } from "../api.js";
import { postsBody } from '../dom.js';
import { PostViewDto } from "../dto/posts.dto.js";
import { state } from '../state.js';

function renderListStatus(status: 'loading' | 'empty' | 'error' | 'success', errorMessage?: string) {
    if (status === 'loading') {
        postsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Завантаження...</td></tr>';
    } else if (status === 'empty') {
        postsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Оголошень поки немає</td></tr>';
    } else if (status === 'error') {
        postsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Помилка: ${errorMessage}</td></tr>`;
    } else {
        postsBody.innerHTML = ''; 
    }
}

export async function loadPosts() {
    renderListStatus('loading');
    try {
        const categoryToSend = state.filters.category === "Всі категорії" ? "" : state.filters.category;
        const posts = await api.getPosts(
            categoryToSend,
            state.filters.search,
            state.filters.page,
            state.filters.limit
        );
        if(!posts || posts.length === 0) {
            renderListStatus('empty');
            return;
        }
        renderListStatus('success');
        postsBody.innerHTML = '';
        posts.forEach((post: PostViewDto) => {
            const tr = document.createElement('tr');

            const titleTd = document.createElement('td');
            titleTd.textContent = post.title;

            const categoryTd = document.createElement('td');
            categoryTd.textContent = post.category;

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
            postsBody.appendChild(tr);
        });

    } catch (error: any) {
        console.error(error);
        renderListStatus('error', error.message || 'Не вдалося завантажити дані з сервера');
    }
    }