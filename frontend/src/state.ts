
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
    };
    idEditing: string | null;
    currentUserId: number | null; 
}
export const state: AppState = {
    items: [],
    ui: { kind: uiKinds.ok, message: "" },
    filters: { 
        search: "", 
        category: "all", 
        sortBy: "date", 
        sortOrder: "desc" 
    },
    idEditing: null,
    currentUserId: null
};