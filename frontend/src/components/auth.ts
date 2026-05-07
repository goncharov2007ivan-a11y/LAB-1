import { api } from "../api.js";
import { state } from "../state.js";
import { authBtn, userGreeting, userNameDisplay } from "../dom.js"
import { loadPosts } from "../views/postsList.js";

export async function handleAuth() {
    if(state.currentUserId) {
        state.currentUserId = null;
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserName');
        updateAuthUI();
        await loadPosts();
        return;
    }

    const email = prompt("Введіть email для входу (test@example.com)");
    if (!email) return;

    try {
        const users = await api.getUsers();
        const user = users.find((u:any) => u.email === email);

        if (!user) {
            alert("Користувача з таким email не знайдено в базі!");
            return;
        }
        state.currentUserId = user.id;
        localStorage.setItem('currentUserId', String(user.id));
        localStorage.setItem('currentUserName', user.name || user.email);

        updateAuthUI();
        await loadPosts();
        alert(`Вітаємо, ви успішно увійшли!`);
        
    } catch (error) {
        alert("Помилка входу");
        console.error(error);
    }
}
export function updateAuthUI() {
    const savedName = localStorage.getItem('currentUserName');
    
    if (state.currentUserId && savedName) {
        authBtn.textContent = "Вийти";
        authBtn.classList.replace('primary', 'outline');
        userNameDisplay.textContent = savedName;
        userGreeting.hidden = false;
    } else {
        authBtn.textContent = "Увійти";
        authBtn.classList.replace('outline', 'primary');
        userGreeting.hidden = true;
    }
}
export function initAuth() {
    const savedId = localStorage.getItem('currentUserId');
    if (savedId) {
        state.currentUserId = Number(savedId);
    }
    updateAuthUI();
}