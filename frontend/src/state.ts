
import type { PostViewDto } from "./dto/posts.dto.js";

export const uiKinds = {
    ok: "ok",
    loading: "loading",
    error: "error",
} as const;

export interface AppState {
    items: PostViewDto[]; 
    ui: {
        kind: string;
        message: string;
    };
    filters: {
        search: string;
        category: string;
        sortBy: "title" | "category" | "authorName" | "date"; 
        sortOrder: "asc" | "desc";
        page: number;
        limit: number;
    };
    idEditing: string | null;
    currentUserId: number | null; 
}
export const state: AppState = {
    items: [],
    ui: { kind: uiKinds.ok, message: "" },
    filters: { 
        search: "", 
        category: "Всі категорії", 
        sortBy: "date", 
        sortOrder: "desc",
        page: 1,
        limit: 10
    },
    idEditing: null,
    currentUserId: null
};