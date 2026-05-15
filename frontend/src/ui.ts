

export function showNotice(message: string, isError: boolean = false) {
    const noticeEl = document.getElementById('notice') as HTMLDivElement;
    if (!noticeEl) return;
    noticeEl.textContent = message;
    noticeEl.classList.add('show');
    if(isError) {
        noticeEl.classList.add('error');
        noticeEl.classList.remove('success');
    } else {
        noticeEl.classList.add('success');
        noticeEl.classList.remove('error');
    }

    setTimeout(() => {
        noticeEl.classList.remove('show');
    }, 3000);
}

export const clearError = (input: HTMLElement, errorDiv: HTMLElement) => {
    input.classList.remove('input-error');
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
};

export const showError = (input: HTMLElement, errorDiv: HTMLElement, message: string) => {
    input.classList.add('input-error');
    errorDiv.classList.add('show');
    errorDiv.textContent = message;
};
