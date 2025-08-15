import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { changePassword  } from "../../../services/authApi";
import { useResetPassword } from "../../../contexts/ResetPasswordContexts";
const LockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

function ChangePasswordScreen() {
    const navigate = useNavigate();
    const [form, setForm] = useState({password: "", confirmedPassword: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { emailForReset, codeForReset } = useResetPassword();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!emailForReset) {
            navigate("/forgot-password");
        }
    }, [emailForReset, navigate]);

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
            await changePassword({
                email: emailForReset,
                password: form.password,
                confirmedPassword: form.confirmedPassword,
                code: codeForReset
            });
            setSuccess("Senha alterada com sucesso! Redirecionando para o login...");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao alterar a senha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Definir Nova Senha</h2>
                    <p className="text-gray-500 mt-2">Insira o código de 6 dígitos e sua nova senha.</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">{error}</div>}
                {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg" role="alert">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon className="w-5 h-5 text-gray-400" /></span>
                        <input name="password" type="password" required className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Nova senha" value={form.password} onChange={handleChange} />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon className="w-5 h-5 text-gray-400" /></span>
                        <input name="confirmedPassword" type="password" required className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Confirmar nova senha" value={form.confirmedPassword} onChange={handleChange} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700">
                        {loading ? "Alterando..." : "Alterar Senha"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordScreen;