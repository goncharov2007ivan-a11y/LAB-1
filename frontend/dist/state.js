export const uiKinds = {
    ok: "ok",
    loading: "loading",
    error: "error",
};
export const state = {
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
