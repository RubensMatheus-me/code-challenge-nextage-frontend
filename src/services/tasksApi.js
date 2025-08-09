import api from "./api";

export const getTasks = async ({status, page = 0, size = 10, sortBy = "createdBy", direction = "desc"}) => {
    const params = {};

    if (status) params.status = status;
    params.page = page;
    params.size = size;
    params.sortBy = sortBy;
    params.direction = direction;

    const response = await api.get("/tasks", {params});

    return response.data;
}

export const getTaskById = async (id) => {
    const response = await api.get(`/tasks/${id}`);

    return response.data;
}

export const add = async (title, description) => {
    const response = await api.post("/tasks", {title, description});

    return response.data;
}

export const update = async (id, title, description) => {
    const response = await api.put(`/tasks/${id}`, {title, description});

    return response.data;
}

export const updateStatus = async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });

    return response.data;
}

export const remove = async (id) => {
    const response = await api.delete(`/tasks/${id}`);

    return response.data;
}