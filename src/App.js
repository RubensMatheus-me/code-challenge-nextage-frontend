import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Home from "./pages/home/Home";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import { useState } from "react";

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
        <Routes>
            <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setAuthToken={setAuthToken}/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/home" element={token ? <Home setAuthToken={setAuthToken} /> : <Navigate to = "/login" />} />
        </Routes>
    </Router>

   );
}