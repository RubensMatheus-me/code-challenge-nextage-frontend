import React from "react";
import LoginScreen from "../../components/login/LoginScreen";

export default function Login({setAuthToken}) {
    return <LoginScreen setAuthToken={setAuthToken} />;
}