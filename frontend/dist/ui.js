export function showNotice(message, isError = false) {
    const noticeEl = document.getElementById('notice');
    if (!noticeEl)
        return;
    noticeEl.textContent = message;
    noticeEl.classList.add('show');
    if (isError) {
        noticeEl.classList.add('error');
        noticeEl.classList.remove('success');
    }
    else {
        noticeEl.classList.add('success');
        noticeEl.classList.remove('error');
    }
    setTimeout(() => {
        noticeEl.classList.remove('show');
    }, 3000);
}
export const clearError = (input, errorDiv) => {
    input.classList.remove('input-error');
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
};
export const showError = (input, errorDiv, message) => {
    input.classList.add('input-error');
    errorDiv.classList.add('show');
    errorDiv.textContent = message;
};
