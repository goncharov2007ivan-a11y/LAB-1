
import type { PostViewDto } from "../../shared/dtos/posts.dto";

export const uiKinds = {
    ok: "ok",
    empty: "empty",
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
        sortOrder: "asc" | "desc";
        page: number;
        limit: number;
    };
    idEditing: string | null;
    currentUserId: string | null; 
}
export const state: AppState = {
    items: [],
    ui: { kind: uiKinds.ok, message: "" },
    filters: { 
        search: "", 
        category: "Всі категорії",  
        sortOrder: "desc",
        page: 1,
        limit: 10
    },
    idEditing: null,
    currentUserId: null
};