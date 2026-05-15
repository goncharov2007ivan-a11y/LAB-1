import { api } from '../api.js';
import { state } from '../state.js';
import { showNotice, showError, clearError } from '../ui.js';
import { CreateUserSchema } from '../../../shared/dtos/users.dto.js';

let isLoginMode = false;

const modalOverlay = document.getElementById('user-modal-overlay') as HTMLDivElement;
const userForm = document.getElementById('create-user-form') as HTMLFormElement;
const nameInput = document.getElementById('user-name') as HTMLInputElement;
const emailInput = document.getElementById('user-email') as HTMLInputElement;

const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;
const nameFieldWrapper = document.getElementById('name-field-wrapper') as HTMLDivElement;
const modalSubmitBtn = document.getElementById('modal-submit-btn') as HTMLButtonElement;
const toggleAuthModeBtn = document.getElementById('toggle-auth-mode') as HTMLAnchorElement;

const nameError = createErrorElement(nameInput, 'userNameError');
const emailError = createErrorElement(emailInput, 'userEmailError');

function createErrorElement(input: HTMLElement, id: string): HTMLDivElement {
    let errDiv = document.getElementById(id) as HTMLDivElement;
    if (!errDiv) {
        errDiv = document.createElement('div');
        errDiv.id = id;
        errDiv.className = 'error-text';
        input.after(errDiv);
    }
    return errDiv;
}

toggleAuthModeBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    isLoginMode = !isLoginMode;
    
    clearUserFormErrors();

    if (isLoginMode) {
        modalTitle.textContent = 'Вхід';
        nameFieldWrapper.hidden = true;
        modalSubmitBtn.textContent = 'Увійти';
        toggleAuthModeBtn.textContent = 'Немає акаунта? Зареєструватися';
    } else {
        modalTitle.textContent = 'Створити акаунт';
        nameFieldWrapper.hidden = false;
        modalSubmitBtn.textContent = 'Зареєструватися';
        toggleAuthModeBtn.textContent = 'Вже маєте акаунт? Увійти';
    }
});

export function openUserModal() {
    isLoginMode = false;
    if (modalTitle) modalTitle.textContent = 'Створити акаунт';
    if (nameFieldWrapper) nameFieldWrapper.hidden = false;
    if (modalSubmitBtn) modalSubmitBtn.textContent = 'Зареєструватися';
    if (toggleAuthModeBtn) toggleAuthModeBtn.textContent = 'Вже маєте акаунт? Увійти';

    clearUserFormErrors();
    userForm.reset();
    modalOverlay.hidden = false;
}

export function closeUserModal() {
    modalOverlay.hidden = true;
}

function clearUserFormErrors() {
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
}

export async function handleUserRegistration() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    clearUserFormErrors();

    if (!isLoginMode) {
        const result = CreateUserSchema.shape.body.safeParse({ name, email });
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                if (issue.path[0] === 'name') showError(nameInput, nameError, issue.message);
                if (issue.path[0] === 'email') showError(emailInput, emailError, issue.message);
            });
            return;
        }
    } else {
        if (!email) {
            showError(emailInput, emailError, "Введіть email");
            return;
        }
    }

    try {
        modalSubmitBtn.disabled = true;
        modalSubmitBtn.textContent = isLoginMode ? 'Вхід...' : 'Реєстрація...';

        let user;

        if (isLoginMode) {
            user = await api.loginUser(email); 
        } else {
            user = await api.createUser({ name, email });
        }

        if (!user) {
            throw new Error("Сервер не повернув дані");
        }

        state.currentUserId = String(user.id);
        localStorage.setItem('currentUserId', String(user.id));
        localStorage.setItem('currentUserName', user.name);

        updateAuthUI(user.name);
        
        closeUserModal();
        showNotice(isLoginMode ? "З поверненням!" : "Вітаємо в системі!");

    } catch (error: any) {
        showNotice(error.message || "Помилка авторизації", true);
    } finally {
        modalSubmitBtn.disabled = false;
        modalSubmitBtn.textContent = isLoginMode ? 'Увійти' : 'Зареєструватися';
    }
}

export function updateAuthUI(name: string) {
    const authBtn = document.getElementById('auth-btn');
    const greeting = document.getElementById('user-greeting');
    const nameDisplay = document.getElementById('user-name-display');

    if (authBtn && greeting && nameDisplay) {
        authBtn.hidden = true;
        greeting.hidden = false;
        nameDisplay.textContent = name;
    }
}