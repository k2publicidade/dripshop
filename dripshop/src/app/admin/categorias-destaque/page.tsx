"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Save, X, ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";

interface FeaturedCategory {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    buttonText: string;
    position: number;
    isActive: boolean;
}

interface FormData {
    title: string;
    imageUrl: string;
    linkUrl: string;
    buttonText: string;
    isActive: boolean;
}

const emptyForm: FormData = {
    title: "",
    imageUrl: "",
    linkUrl: "",
    buttonText: "COMPRE AQUI",
    isActive: true,
};

export default function FeaturedCategoriesAdmin() {
    const [categories, setCategories] = useState<FeaturedCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch("/api/featured-categories?all=true");
            const json = await res.json();
            if (json.success) setCategories(json.data);
        } catch (err) {
            console.error("Erro ao carregar:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);


    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) {
                await fetch(`/api/featured-categories/${editing}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            } else {
                await fetch("/api/featured-categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            }
            setEditing(null);
            setCreating(false);
            setForm(emptyForm);
            fetchCategories();
        } catch (err) {
            console.error("Erro ao salvar:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover esta categoria em destaque?")) return;
        try {
            await fetch(`/api/featured-categories/${id}`, { method: "DELETE" });
            fetchCategories();
        } catch (err) {
            console.error("Erro ao deletar:", err);
        }
    };

    const handleToggleActive = async (cat: FeaturedCategory) => {
        try {
            await fetch(`/api/featured-categories/${cat.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !cat.isActive }),
            });
            fetchCategories();
        } catch (err) {
            console.error("Erro ao atualizar:", err);
        }
    };

    const handleMove = async (cat: FeaturedCategory, direction: "up" | "down") => {
        const idx = categories.findIndex((c) => c.id === cat.id);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= categories.length) return;

        const swapCat = categories[swapIdx];
        try {
            await Promise.all([
                fetch(`/api/featured-categories/${cat.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ position: swapCat.position }),
                }),
                fetch(`/api/featured-categories/${swapCat.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ position: cat.position }),
                }),
            ]);
            fetchCategories();
        } catch (err) {
            console.error("Erro ao reordenar:", err);
        }
    };

    const startEdit = (cat: FeaturedCategory) => {
        setEditing(cat.id);
        setCreating(false);
        setForm({
            title: cat.title,
            imageUrl: cat.imageUrl,
            linkUrl: cat.linkUrl,
            buttonText: cat.buttonText,
            isActive: cat.isActive,
        });
    };

    const startCreate = () => {
        setCreating(true);
        setEditing(null);
        setForm(emptyForm);
    };

    const cancelEdit = () => {
        setEditing(null);
        setCreating(false);
        setForm(emptyForm);
    };

    const isFormOpen = editing !== null || creating;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-[#111]">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1
                                className="text-xl font-black uppercase tracking-tight"
                                style={{ fontFamily: "Space Grotesk, sans-serif" }}
                            >
                                Categorias em Destaque
                            </h1>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">
                                Seção da Home Page
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={startCreate}
                        disabled={isFormOpen}
                        className="flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Form */}
                {isFormOpen && (
                    <div className="mb-8 bg-[#161616] border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">
                                {editing ? "Editar Categoria" : "Nova Categoria em Destaque"}
                            </h2>
                            <button
                                onClick={cancelEdit}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Ex: OVERSIZED"
                                        className="w-full bg-[#0a0a0a] border border-gray-700 text-white px-4 py-3 text-sm font-bold uppercase focus:border-white focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                                        URL da Imagem
                                    </label>
                                    <input
                                        type="text"
                                        value={form.imageUrl}
                                        onChange={(e) =>
                                            setForm({ ...form, imageUrl: e.target.value })
                                        }
                                        placeholder="https://..."
                                        className="w-full bg-[#0a0a0a] border border-gray-700 text-white px-4 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                                        Link de Destino
                                    </label>
                                    <input
                                        type="text"
                                        value={form.linkUrl}
                                        onChange={(e) =>
                                            setForm({ ...form, linkUrl: e.target.value })
                                        }
                                        placeholder="/categoria/camisetas"
                                        className="w-full bg-[#0a0a0a] border border-gray-700 text-white px-4 py-3 text-sm focus:border-white focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                                        Texto do Botão
                                    </label>
                                    <input
                                        type="text"
                                        value={form.buttonText}
                                        onChange={(e) =>
                                            setForm({ ...form, buttonText: e.target.value })
                                        }
                                        placeholder="COMPRE AQUI"
                                        className="w-full bg-[#0a0a0a] border border-gray-700 text-white px-4 py-3 text-sm font-bold uppercase focus:border-white focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm({ ...form, isActive: !form.isActive })
                                        }
                                        className={`w-10 h-6 rounded-full relative transition-colors ${form.isActive ? "bg-green-500" : "bg-gray-600"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isActive ? "left-[18px]" : "left-0.5"
                                                }`}
                                        />
                                    </button>
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                                        {form.isActive ? "Ativo" : "Inativo"}
                                    </span>
                                </div>
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                                    Preview
                                </label>
                                <div className="relative aspect-[3/2] bg-gray-900 overflow-hidden">
                                    {form.imageUrl ? (
                                        <img
                                            src={form.imageUrl}
                                            alt={form.title || "Preview"}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">
                                            Sem imagem
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                                        <h3
                                            className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-2"
                                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                                        >
                                            {form.title || "TÍTULO"}
                                        </h3>
                                        <span className="inline-block w-fit border border-white/70 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                                            {form.buttonText || "COMPRE AQUI"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.title || !form.imageUrl || !form.linkUrl}
                                className="flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest px-8 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Salvando..." : editing ? "Atualizar" : "Criar"}
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">
                            Carregando...
                        </p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-800">
                        <p className="text-gray-500 text-sm mb-4">
                            Nenhuma categoria em destaque cadastrada.
                        </p>
                        <button
                            onClick={startCreate}
                            className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-gray-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Criar Primeira
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {categories.map((cat, index) => (
                            <div
                                key={cat.id}
                                className={`flex items-center gap-4 bg-[#161616] border border-gray-800 p-4 transition-all hover:border-gray-700 ${!cat.isActive ? "opacity-50" : ""
                                    }`}
                            >
                                {/* Drag handle + position */}
                                <div className="flex flex-col items-center gap-0.5">
                                    <button
                                        onClick={() => handleMove(cat, "up")}
                                        disabled={index === 0}
                                        className="text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <GripVertical className="w-4 h-4 text-gray-600" />
                                    <button
                                        onClick={() => handleMove(cat, "down")}
                                        disabled={index === categories.length - 1}
                                        className="text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Thumbnail */}
                                <div className="w-24 h-16 bg-gray-900 overflow-hidden shrink-0">
                                    {cat.imageUrl && (
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm uppercase tracking-wider truncate">
                                        {cat.title}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                        {cat.linkUrl}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleToggleActive(cat)}
                                        className={`p-2 transition-colors ${cat.isActive
                                                ? "text-green-400 hover:text-green-300"
                                                : "text-gray-600 hover:text-gray-400"
                                            }`}
                                        title={cat.isActive ? "Desativar" : "Ativar"}
                                    >
                                        {cat.isActive ? (
                                            <Eye className="w-4 h-4" />
                                        ) : (
                                            <EyeOff className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => startEdit(cat)}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                        title="Remover"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="mt-8 p-4 border border-gray-800 bg-[#111]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                        💡 As categorias em destaque aparecem na home page logo após a barra de benefícios.
                        Cada card mostra a imagem de fundo, título e botão de ação. Use o controle de
                        posição (setas) para reordenar os cards. Cards inativos não aparecem na home.
                    </p>
                </div>
            </div>
        </div>
    );
}
