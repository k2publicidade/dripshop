"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, RefreshCcw } from "lucide-react";

export default function RecuperarSenhaPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simular API
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Branding/Image */}
            <div className="hidden lg:flex bg-gray-950 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800"
                        alt="Background"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="relative z-10 text-center max-w-md">
                    <Link href="/" className="text-5xl font-extrabold text-white mb-8 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        DRIPSHOP
                    </Link>
                    <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
                    <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Não esquenta com a senha.
                    </h2>
                    <p className="text-gray-400">
                        A gente te ajuda a recuperar o acesso rapidinho. Estilo não pode esperar.
                    </p>
                </div>
            </div>

            {/* Right Side: Recover Form */}
            <div className="flex items-center justify-center p-6 bg-white overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-black" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                            DRIPSHOP
                        </h1>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-extrabold mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                            Recuperar Senha
                        </h2>
                        <p className="text-gray-500">
                            Informe seu email cadastrado para receber as instruções de redefinição.
                        </p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <RefreshCcw className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Enviar Instruções"
                                )}
                            </button>

                            <div className="text-center">
                                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black font-semibold transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Voltar ao Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-green-50 rounded-3xl p-8 text-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-green-900 mb-3">Email Enviado!</h3>
                            <p className="text-green-700 text-sm mb-6">
                                Enviamos instruções para <strong>{email}</strong>. Por favor, verifique sua caixa de entrada e spam.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-sm font-bold text-green-900 underline underline-offset-4 hover:opacity-70"
                            >
                                Tentar outro email
                            </button>

                            <div className="mt-8 border-t border-green-100 pt-6">
                                <Link href="/login" className="btn-primary w-full py-3.5 text-sm">
                                    Ir para o Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
