export const viewList = document.getElementById('view-list') as HTMLDivElement;
export const viewForm = document.getElementById('view-form') as HTMLDivElement;
export const viewPost = document.getElementById('view-post') as HTMLDivElement;
export const createPostForm = document.getElementById('create-post-form') as HTMLFormElement;

export const postsBody = document.getElementById('posts-body') as HTMLTableSectionElement;
export const categoryListItems = document.querySelectorAll('.category-menu li');
export const categoryList = document.getElementById('category-list') as HTMLUListElement;
export const searchInput = document.getElementById('search-input') as HTMLInputElement;

export const createPostBtn = document.getElementById('create-post-btn') as HTMLButtonElement;
export const backToListBtn = document.getElementById('back-to-list-btn') as HTMLButtonElement;
export const authBtn = document.getElementById('auth-btn') as HTMLButtonElement;

export const userGreeting = document.getElementById('user-greeting') as HTMLSpanElement;
export const userNameDisplay = document.getElementById('user-name-display') as HTMLElement;

export const sidebar = document.querySelector('.sidebar') as HTMLDivElement;

export const titleInput = document.querySelector('#title') as HTMLInputElement;
export const categoryInput = document.querySelector('#category') as HTMLSelectElement;
export const contentInput = document.querySelector('#content') as HTMLTextAreaElement;

export const titleError = document.getElementById('titleError') as HTMLDivElement;
export const categoryError = document.getElementById('categoryError') as HTMLDivElement;
export const contentError = document.getElementById('contentError') as HTMLDivElement;

export const modalOverlay = document.getElementById('user-modal-overlay') as HTMLDivElement;
export const userForm = document.getElementById('create-user-form') as HTMLFormElement;
export const nameInput = document.getElementById('user-name') as HTMLInputElement;
export const emailInput = document.getElementById('user-email') as HTMLInputElement;

export const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;
export const nameFieldWrapper = document.getElementById('name-field-wrapper') as HTMLDivElement;
export const modalSubmitBtn = document.getElementById('modal-submit-btn') as HTMLButtonElement;
export const toggleAuthModeBtn = document.getElementById('toggle-auth-mode') as HTMLAnchorElement;

export const openProfileBtn = document.getElementById('open-profile-btn') as HTMLButtonElement;
export const profileModalOverlay = document.getElementById('profile-modal-overlay') as HTMLDivElement;
export const closeProfileBtn = document.getElementById('close-profile-btn') as HTMLButtonElement;
export const editProfileForm = document.getElementById('edit-profile-form') as HTMLFormElement;
export const profileNameInput = document.getElementById('profile-name') as HTMLInputElement;
export const profileEmailInput = document.getElementById('profile-email') as HTMLInputElement;
export const profileLogoutBtn = document.getElementById('profile-logout-btn') as HTMLButtonElement;
export const profileDeleteBtn = document.getElementById('profile-delete-btn') as HTMLButtonElement;

export const passwordInput = document.getElementById('user-password') as HTMLInputElement;