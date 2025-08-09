import api from "./api";

export const verifyEmail = async (token) => {
    const response = await api.get("/email/verify", {
        params: {token}
    });

    return response.data;
}

export const resendVerification = async (email) => {
    const response = await api.post("/email/resend-verification", {email});

    return response.data;
}

export const sendForgotPassword = async(email) => {
    const response = await api.post("/email/forgot-password", {email});

    return response.data;

}