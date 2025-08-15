import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import AnimatedPage from "./components/animations/AnimatedPage";
import { ProtectedResetRoute } from "./components/protectedRoute/ProtectedResetRoute";
import Home from "./pages/home/Home";
import ChangePassword from "./pages/changePassword/ChangePassword";
import VerifyCode from "./pages/verifyCode/VerifyCode";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { ResetPasswordProvider } from "./contexts/ResetPasswordContexts";

export default function App() {
   const [token, setToken] = useState(localStorage.getItem("token"));

    const setAuthToken = (newToken) => {
        if(newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
        setToken(newToken);
    };
    return (
        <Router>
            <ResetPasswordProvider>
                <AnimatePresence mode="wait">
                    <AppRoutes token={token} setAuthToken={setAuthToken} />
                </AnimatePresence>
            </ResetPasswordProvider>
        </Router>
    );
}

   const AppRoutes = ({ token, setAuthToken }) => {
    const location = useLocation();

    return (
         <Routes location={location} key={location.pathname}>
            <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/home" element={token ? <AnimatedPage><Home setAuthToken={setAuthToken} /></AnimatedPage> : <Navigate to="/login" />} />
            <Route path="/login" element={<AnimatedPage><Login setAuthToken={setAuthToken} /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
            <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
            
            <Route path="/verify-code" element={<ProtectedResetRoute><AnimatedPage><VerifyCode /></AnimatedPage></ProtectedResetRoute>}/>
            <Route path="/change-password" element={<ProtectedResetRoute><AnimatedPage><ChangePassword /></AnimatedPage></ProtectedResetRoute>}/>
        </Routes>
    );

};

