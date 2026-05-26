import { api } from '../api.js';
import { profileModalOverlay, profileNameInput, profileEmailInput } from '../dom.js';
import { showNotice } from '../ui.js';
export async function openProfileModal() {
    const currentUserId = localStorage.getItem('currentUserId');

    
    if (!currentUserId) {
        showNotice("Помилка: Ви не авторизовані", true);
        return;
    }

    try {

        const user = await api.getUserById(currentUserId);

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