import React from "react";
import LoginScreen from "../../components/screens/login/LoginScreen";

export default function Login({setAuthToken}) {
    return <LoginScreen setAuthToken={setAuthToken} />;
}