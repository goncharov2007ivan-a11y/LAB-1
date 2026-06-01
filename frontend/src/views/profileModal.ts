import { api } from '../api.js';
import { profileModalOverlay, profileNameInput, profileEmailInput } from '../dom.js';
import { showNotice } from '../ui.js';

export async function openProfileModal() {
    const userStr = localStorage.getItem('currentUser');
    
    if (!userStr) {
        showNotice("Помилка: Ви не авторизовані", true);
        return;
    }

    try {
        const currentUser = JSON.parse(userStr);
        // Беремо ID з об'єкта
        const user = await api.getUserById(currentUser.id);

        if (user) {
            profileNameInput.value = user.name;
            profileEmailInput.value = user.email;
            profileModalOverlay.hidden = false;
        }
    } catch (error) {
        console.error(error);
        showNotice("Не вдалося завантажити профіль", true);
    }
}

export function closeProfileModal() {
    profileModalOverlay.hidden = true;
}