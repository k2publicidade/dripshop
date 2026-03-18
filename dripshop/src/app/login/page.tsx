"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const success = await login(email, password);
        if (success) {
            router.push("/conta");
        } else {
            setError("Email ou senha inválidos. Tente novamente.");
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-950 text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10">
                    <Link href="/" className="inline-block">
                        <img
                            src="/logo.svg"
                            alt="DRIPSHOP"
                            className="h-8 w-auto object-contain brightness-0 invert"
                        />
                    </Link>
                </div>
                <div className="relative z-10 space-y-6">
                    <h2 className="text-5xl font-bold leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        O Drip<br />Chama
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md">
                        Acesse sua conta para garantir os drops mais hypados, acompanhar pedidos e colar na VIP.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2">📦 Frete Grátis R$199+</span>
                        <span className="flex items-center gap-2">💳 6x sem juros</span>
                    </div>
                </div>
                <div className="relative z-10 text-sm text-gray-600">
                    © 2025 DripShop
                </div>
            </div>

            {/* Right - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-block">
                            <img
                                src="/logo.svg"
                                alt="DRIPSHOP"
                                className="h-8 w-auto object-contain mx-auto"
                            />
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                            Entrar na conta
                        </h2>
                        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
                            Bem-vindo de volta! Entre para continuar.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded-none border-gray-300 accent-black" />
                                <span className="text-gray-500">Lembrar de mim</span>
                            </label>
                            <Link href="/recuperar-senha" className="text-black hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Entrar <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">ou</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Não tem uma conta?{" "}
                        <Link href="/cadastro" className="text-black font-bold hover:underline">
                            Entrar pra gangue
                        </Link>
                    </p>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" /> Voltar pro street
                    </Link>
                </div>
            </div>
        </div>
    );
}
