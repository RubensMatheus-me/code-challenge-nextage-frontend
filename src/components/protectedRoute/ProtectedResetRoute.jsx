import React from "react";
import { useResetPassword } from "../../contexts/ResetPasswordContexts";
import { Navigate } from "react-router-dom";


export function ProtectedResetRoute({ children }) {
    const { emailForReset} = useResetPassword();

    if (!emailForReset ) {
        return <Navigate to="/forgot-password" replace />;
    }
    return children;
}
