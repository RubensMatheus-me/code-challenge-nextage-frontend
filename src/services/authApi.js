import api from "./api";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", {email, password});

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }

    return response.data;
};

export const register = async (username, email, password, confirmedPassword) => {
    const response = await api.post("/auth/register", {username, email, password, confirmedPassword});

    return response.data;
}

export const changePassword = async (email, password, confirmedPassword, code) => {
    const response = await api.post("auth/change-password", {email, password, confirmedPassword, code});

    return response.data;
}
/*
export const getUserProfile = async () => {
    const response = await api.get("/users/profile");

    return response.data;
}
*/