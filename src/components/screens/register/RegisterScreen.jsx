import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/authApi";

const ClipboardCheck = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>;
const UserIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MailIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;


function RegisterScreen() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: "", confirmedPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.password !== form.confirmedPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await register(form.username, form.email, form.password, form.confirmedPassword);
            setSuccess("Registro realizado com sucesso! Verifique seu email, Você será redirecionado para o login.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao registrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row-reverse bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                    <div className="flex flex-col items-center text-center">
                        <ClipboardCheck className="w-16 h-16 text-white" />
                        <h1 className="text-4xl font-bold mt-4">Junte-se a nós</h1>
                        <p className="mt-2 text-indigo-200">Comece a organizar as suas tarefas hoje mesmo.</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Crie a sua Conta</h2>
                    <p className="text-gray-500 mb-8">É rápido e fácil.</p>
                    
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">{error}</div>}
                    {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg" role="alert">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon className="w-5 h-5 text-gray-400" /></span>
                                <input id="username" name="username" type="text" required className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Nome do utilizador" value={form.username} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><MailIcon className="w-5 h-5 text-gray-400" /></span>
                                <input id="email-register" name="email" type="email" required className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="O seu e-mail" value={form.email} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon className="w-5 h-5 text-gray-400" /></span>
                                <input id="password-register" name="password" type="password" required className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Crie uma senha" value={form.password} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon className="w-5 h-5 text-gray-400" /></span>
                                <input id="confirmedPassword" name="confirmedPassword" type="password" required className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Confirme a senha" value={form.confirmedPassword} onChange={handleChange} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105">
                            {loading ? "A registar..." : "Registar"}
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <button onClick={() => navigate("/login")} className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            Faça login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterScreen;