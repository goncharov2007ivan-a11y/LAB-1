import { api } from "../api.js";
import { postsBody } from '../dom.js';
import { PostViewDto } from "../../../shared/dtos/posts.dto.js";
import { state, uiKinds } from '../state.js'; 

function renderPosts() {

    postsBody.innerHTML = '';

    if (state.ui.kind === uiKinds.loading) {
        postsBody.innerHTML = '<tr><td colspan="6">Завантаження...</td></tr>';
        return; 
    } 
    
    if (state.ui.kind === uiKinds.empty) {
        postsBody.innerHTML = '<tr><td colspan="6">Оголошень поки немає</td></tr>';
        return;
    } 
    
    if (state.ui.kind === uiKinds.error) {
        postsBody.innerHTML = `
        <tr>
            <td colspan="6">
                <strong>Помилка: ${state.ui.message}</strong><br>
                <span>
                    Що робити: Перевірте підключення до інтернету, переконайтеся, що сервер запущено, або спробуйте оновити сторінку через кілька хвилин.
                </span>
            </td>
        </tr>`;
        return;
    }

    state.items.forEach((post: PostViewDto) => {
        const tr = document.createElement('tr');

        tr.dataset.viewId = post.id;

        const titleTd = document.createElement('td');
        titleTd.innerHTML = post.title;

        const categoryTd = document.createElement('td');
        categoryTd.innerHTML = post.category;

        const contentTd = document.createElement('td');
        contentTd.innerHTML = post.content;

        const authorTd = document.createElement('td');
        authorTd.innerHTML = post.author;

        const dateTd = document.createElement('td');
        dateTd.innerHTML = new Date(post.date).toLocaleDateString('uk-UA');


        tr.append(titleTd, categoryTd, contentTd, authorTd, dateTd);
        postsBody.appendChild(tr);
    });
}

export async function loadPosts() {
    state.ui.kind = uiKinds.loading;
    renderPosts();

    try {
        const categoryToSend = state.filters.category === "Всі категорії" ? "" : state.filters.category;
        const posts = await api.getPosts(
            categoryToSend,
            state.filters.search,
            state.filters.page,
            state.filters.limit,
            state.filters.sortOrder
        );

        if (!posts || posts.length === 0) {
            state.ui.kind = uiKinds.empty;
            state.items = []; 
            renderPagination(0);
        } else {
            state.ui.kind = uiKinds.ok;
            state.items = posts;
            renderPagination(posts.length);
        }
        
        renderPosts();

    } catch (error) {
        console.error(error);
        state.ui.kind = uiKinds.error;
        if (error instanceof Error) {
            state.ui.message = error.message; 
        } else {
            state.ui.message = 'Не вдалося завантажити дані з сервера';
        }
        renderPosts();
    }
}
function renderPagination(currentItemsCount: number) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = ''; 

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Попередня';
    prevBtn.className = 'btn outline';
    prevBtn.disabled = state.filters.page === 1;
    prevBtn.onclick = () => {
        state.filters.page -= 1;
        loadPosts(); 
    };

    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `Сторінка ${state.filters.page}`;
    pageIndicator.style.alignSelf = 'center';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Наступна →';
    nextBtn.className = 'btn outline';
    nextBtn.disabled = currentItemsCount < state.filters.limit;
    nextBtn.onclick = () => {
        state.filters.page += 1;
        loadPosts();
    };

    paginationContainer.append(prevBtn, pageIndicator, nextBtn);
}