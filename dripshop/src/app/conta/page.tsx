"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Save, Check } from "lucide-react";

export default function ContaPage() {
    const { user } = useAuthStore();
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        cpf: user?.cpf || "",
    });
    const [saved, setSaved] = useState(false);

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-300 p-6 lg:p-8">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-8" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Dados Pessoais
                </h2>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Nome completo</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm bg-gray-50"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Telefone</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                placeholder="(11) 99999-9999"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">CPF</label>
                            <input
                                type="text"
                                value={form.cpf}
                                onChange={(e) => updateField("cpf", e.target.value)}
                                placeholder="000.000.000-00"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <button type="submit" className="btn-primary px-8 py-3">
                            {saved ? (
                                <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Salvo!</span>
                            ) : (
                                <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Salvar alterações</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white border border-gray-300 p-6 lg:p-8">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-8" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Alterar Senha
                </h2>
                <form className="space-y-5 max-w-md">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Senha atual</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Nova senha</label>
                        <input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Confirmar nova senha</label>
                        <input
                            type="password"
                            placeholder="Repita a nova senha"
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                        />
                    </div>
                    <button type="submit" className="btn-secondary px-8 py-3 text-sm">
                        Atualizar senha
                    </button>
                </form>
            </div>
        </div>
    );
}
