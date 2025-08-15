import api from "./api";

export const getTasks = async ({ status, page = 0, size = 10, sortBy = "createdBy", direction = "desc" }) => {
    const params = {page, size};
    if (status) params.status = status;
    
    params.sortBy = sortBy;;
    params.direction = direction;

    const response = await api.get("/tasks", { params });
    return response.data;
}

export const getTaskById = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
}


export const add = async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
}


export const update = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
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