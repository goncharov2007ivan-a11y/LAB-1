import { authBtn, userGreeting, userNameDisplay } from "./dom.js"

export function handleLogout() {

    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    updateAuthUI();
    
    window.location.reload();
}

export function updateAuthUI() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
        const user = JSON.parse(userStr);
        authBtn.hidden = true; 
        userNameDisplay.textContent = user.name;
        userGreeting.hidden = false;
    } else {
        authBtn.hidden = false;
        authBtn.textContent = "Увійти";
        authBtn.classList.replace('outline', 'primary');
        userGreeting.hidden = true;
    }
}

export function initAuth() {
    updateAuthUI();
}