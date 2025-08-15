import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useResetPassword} from "../../../contexts/ResetPasswordContexts";
import { verifyCode } from "../../../services/authApi";

const KeyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

function VerifyCodeScreen() {
    const navigate = useNavigate();
    const {emailForReset, setCodeForReset} = useResetPassword();
    

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        if (!emailForReset) {
            navigate("/forgot-password");
        }
    }, [emailForReset, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await verifyCode(emailForReset, code);
            setCodeForReset(code);
            console.log("Código verificado com sucesso:", code);

            navigate("/change-password");

        } catch (err) {
            setError(err.response?.data?.message || "Código inválido ou expirado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                        <KeyIcon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Verifique seu Email</h2>
                    <p className="text-gray-500 mt-2">
                        Enviamos um código de 6 dígitos para <span className="font-semibold text-gray-700">{emailForReset || "seu email"}</span>.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-600 text-center mb-2">
                            Insira o código abaixo
                        </label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            maxLength="6"
                            required
                            className="text-center tracking-[0.8em] text-3xl font-bold block w-full py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="______"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || code.length < 6}
                        className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        {loading ? "Verificando..." : "Verificar Código"}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/forgot-password')} className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyCodeScreen;