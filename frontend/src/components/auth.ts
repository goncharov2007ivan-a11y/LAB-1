import { api } from "../api.js";
import { state } from "../state.js";
import * as DOM from "../dom.js"

export async function handleAuth() {
    if(state.currentUserId) {
        state.currentUserId = null;
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserName');
        updateAuthUI();
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
        alert(`Вітаємо, ви успішно увійшли!`);
    } catch (error) {
        alert("Помилка входу");
        console.error(error);
    }
}
export function updateAuthUI() {
    const savedName = localStorage.getItem('currentUserName');
    
    if (state.currentUserId && savedName) {
        DOM.authBtn.textContent = "Вийти";
        DOM.authBtn.classList.replace('primary', 'outline');
        DOM.userNameDisplay.textContent = savedName;
        DOM.userGreeting.hidden = false;
    } else {
        DOM.authBtn.textContent = "Увійти";
        DOM.authBtn.classList.replace('outline', 'primary');
        DOM.userGreeting.hidden = true;
    }
}
export function initAuth() {
    const savedId = localStorage.getItem('currentUserId');
    if (savedId) {
        state.currentUserId = Number(savedId);
    }
    updateAuthUI();
}