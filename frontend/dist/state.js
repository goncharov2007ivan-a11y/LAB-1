export const uiKinds = {
    ok: "ok",
    empty: "empty",
    loading: "loading",
    error: "error",
};
export const state = {
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
