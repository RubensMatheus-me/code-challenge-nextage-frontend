import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { changePassword  } from "../../services/authApi";

const ClipboardCheck = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>;
const UserIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MailIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const KeyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;



function ResetPasswordScreen({ emailForReset }) {
    const navigate = useNavigate;
    const [form, setForm] = useState({ code: "", password: "", confirmedPassword: "" });
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
            await changePassword( ...form, emailForReset);
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
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Definir Nova Senha</h2>
                    <p className="text-gray-500 mt-2">Insira o código de 6 dígitos e sua nova senha.</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">{error}</div>}
                {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg" role="alert">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="code" type="text" maxLength="6" required className="text-center tracking-[1em] text-2xl font-bold block w-full py-3 bg-gray-50 border border-gray-300 rounded-lg" placeholder="______" value={form.code} onChange={handleChange} />
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

export default ResetPasswordScreen;