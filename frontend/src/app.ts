import { sidebar, viewForm, viewList, viewPost } from './dom.js';
import { loadPosts } from './views/postsList.js';

export async function showView(viewName: "List" | "Form" | "Post") {
    viewList.hidden = viewForm.hidden = viewPost.hidden = sidebar.hidden = true;

    if (viewName === 'List') {
        await loadPosts();
        viewList.hidden = false; 
        sidebar.hidden = false;
    }
    if (viewName === 'Form') viewForm.hidden = false;
    if (viewName === 'Post') viewPost.hidden = false;
}