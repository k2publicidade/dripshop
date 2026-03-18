"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShoppingBag, Check } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function CadastroPage() {
    const router = useRouter();
    const { register, isLoading } = useAuthStore();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);

    const passwordStrength = (pw: string) => {
        let score = 0;
        if (pw.length >= 6) score++;
        if (pw.length >= 10) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const strength = passwordStrength(form.password);
    const strengthLabel = ["", "Fraca", "Fraca", "Média", "Forte", "Muito forte"][strength] || "";
    const strengthColor = ["", "bg-red-500", "bg-red-500", "bg-yellow-500", "bg-green-500", "bg-green-600"][strength] || "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        if (!acceptTerms) {
            setError("Você precisa aceitar os termos de uso.");
            return;
        }

        const success = await register({ email: form.email, password: form.password, name: form.name });
        if (success) {
            router.push("/conta");
        } else {
            setError("Erro ao criar conta. Tente novamente.");
        }
    };

    const updateForm = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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
                <div className="relative z-10 space-y-8">
                    <h2 className="text-5xl font-bold leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Junte-se à<br />Cena
                    </h2>
                    <div className="space-y-4">
                        {[
                            "Acesso antecipado aos drops mais hypados",
                            "Acompanhe suas peças raras em tempo real",
                            "Frete grátis em compras acima de R$199",
                            "Collabs e códigos exclusivos para membros",
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                </div>
                                <span className="text-gray-400">{benefit}</span>
                            </div>
                        ))}
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
                            Criar conta
                        </h2>
                        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
                            Rápido e gratuito. Comece a comprar agora.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                Nome completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={(e) => updateForm("name", e.target.value)}
                                placeholder="Seu nome"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-email" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                Email
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => updateForm("email", e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="reg-password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => updateForm("password", e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
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
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColor : "bg-gray-200"}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">{strengthLabel}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="reg-confirm" className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                Confirmar senha
                            </label>
                            <input
                                id="reg-confirm"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => updateForm("confirmPassword", e.target.value)}
                                placeholder="Repita a senha"
                                required
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>

                        <label className="flex items-start gap-2 cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 rounded-none border-gray-300 accent-black mt-0.5"
                            />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 leading-relaxed">
                                Li e aceito os{" "}
                                <Link href="/p/termos" className="text-black font-medium hover:underline">
                                    Termos de Uso
                                </Link>{" "}
                                e a{" "}
                                <Link href="/p/privacidade" className="text-black font-medium hover:underline">
                                    Política de Privacidade
                                </Link>
                            </span>
                        </label>

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
                                    Criando conta...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Criar minha conta <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="text-black font-bold hover:underline">
                            Colar no login
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
