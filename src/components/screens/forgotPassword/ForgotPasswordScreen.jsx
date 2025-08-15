import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { sendForgotPassword} from "../../../services/emailApi";
import { useResetPassword } from "../../../contexts/ResetPasswordContexts";

const MailIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const KeyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { setEmailForReset } = useResetPassword();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Por favor, insira um e-mail válido.");
      setLoading(false);
      return;
    }
    try {
      await sendForgotPassword(email);
      setSuccess("Se este e-mail existir, você receberá um código de recuperação.");
      setEmailForReset(email);
      setTimeout(() => {
        navigate("/verify-code");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden p-8">
                <div className="text-center mb-8">
                    <KeyIcon className="w-12 h-12 mx-auto text-indigo-600" />
                    <h2 className="text-3xl font-bold text-gray-800 mt-4">Recuperar Senha</h2>
                    <p className="text-gray-500 mt-2">Insira seu e-mail para receber o código de verificação.</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">{error}</div>}
                {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg" role="alert">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><MailIcon className="w-5 h-5 text-gray-400" /></span>
                        <input type="email" required className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700">
                        {loading ? "Enviando..." : "Enviar Código"}
                    </button>
                </form>
                <button onClick={() => navigate("/login")} className="mt-6 text-sm text-gray-600 hover:text-indigo-500 flex items-center gap-2 mx-auto">
                    <ArrowLeftIcon className="w-4 h-4" /> Voltar para o Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPasswordScreen;