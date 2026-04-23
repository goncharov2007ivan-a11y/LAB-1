export const noticeEl = document.getElementById('notice') as HTMLDivElement;

export function showNotice(message: string, isError: boolean = false) {
    if (!noticeEl) return;
    noticeEl.textContent = message;
    
    noticeEl.style.color = isError ? 'red' : 'green';
    noticeEl.style.display = 'block';

    setTimeout(() => {
        noticeEl.textContent = '';
        noticeEl.style.display = 'none';
    }, 3000);
}