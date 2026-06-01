import { api } from '../api.js';
import { showNotice, showError, clearError } from '../ui.js';
import { CreateUserSchema, LoginUserSchema } from '../../../shared/dtos/users.dto.js';
import { emailInput, modalOverlay, modalSubmitBtn, modalTitle, nameFieldWrapper, nameInput, toggleAuthModeBtn, userForm } from '../dom.js';
import { updateAuthUI } from '../auth.js';

const passwordInput = document.getElementById('user-password') as HTMLInputElement;

let isLoginMode = true;

const nameError = createErrorElement(nameInput, 'userNameError');
const emailError = createErrorElement(emailInput, 'userEmailError');
const passwordError = createErrorElement(passwordInput, 'userPasswordError');

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
    modalTitle.textContent = 'Створити акаунт';
    nameFieldWrapper.hidden = false;
    modalSubmitBtn.textContent = 'Зареєструватися';
    toggleAuthModeBtn.textContent = 'Вже маєте акаунт? Увійти';

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
    clearError(passwordInput, passwordError);
}

export async function handleUserRegistration() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim(); 

    clearUserFormErrors();

    if (!isLoginMode) {
        const result = CreateUserSchema.shape.body.safeParse({ name, email, password });
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                if (issue.path[0] === 'name') showError(nameInput, nameError, issue.message);
                if (issue.path[0] === 'email') showError(emailInput, emailError, issue.message);
                if (issue.path[0] === 'password') showError(passwordInput, passwordError, issue.message);
            });
            return;
        }
    } else {
        const result = LoginUserSchema.shape.body.safeParse({ email, password });
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                if (issue.path[0] === 'email') showError(emailInput, emailError, issue.message);
                if (issue.path[0] === 'password') showError(passwordInput, passwordError, issue.message);
            });
            return;
        }
    }

    try {
        modalSubmitBtn.disabled = true;
        modalSubmitBtn.textContent = isLoginMode ? 'Вхід...' : 'Реєстрація...';

        let token = "";
        let user = null;

        if (isLoginMode) {

            const result = await api.loginUser({ email, password });
            token = result.token;
            user = result.user;
        } else {

            await api.createUser({ name, email, password });
            const result = await api.loginUser({ email, password });
            token = result.token;
            user = result.user;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        updateAuthUI();
        closeUserModal();
        showNotice(isLoginMode ? "З поверненням!" : "Вітаємо в системі!");

        setTimeout(() => window.location.reload(), 1000);

    } catch (error: any) {

        if (error.message && error.message.includes('вже існує')) {
            showError(emailInput, emailError, error.message);
        } 
        else if (error.message && error.message.includes('Невірний email або пароль')) {
             showError(passwordInput, passwordError, error.message);
             showError(emailInput, emailError, "");
        } 
        else {
            showNotice(error.message || "Помилка авторизації", true);
        }
    } finally {
        modalSubmitBtn.disabled = false;
        modalSubmitBtn.textContent = isLoginMode ? 'Увійти' : 'Зареєструватися';
    }
}