import * as DOM from './dom.js';
import { loadPosts } from './views/postsList.js';

export async function showView(viewName: "List" | "Form" | "Post") {
    DOM.viewList.hidden = DOM.viewForm.hidden = DOM.viewPost.hidden = DOM.sidebar.hidden = true;

    if (viewName === 'List') {
        await loadPosts();
        DOM.viewList.hidden = false; 
        DOM.sidebar.hidden = false;
    }
    if (viewName === 'Form') DOM.viewForm.hidden = false;
    if (viewName === 'Post') DOM.viewPost.hidden = false;
}