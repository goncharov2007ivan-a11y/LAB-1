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
        category: "Всі категорії",
        sortBy: "date",
        sortOrder: "desc"
    },
    idEditing: null,
    currentUserId: null
};
