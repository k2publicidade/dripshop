"use client";

import { useState } from "react";
import {
    Settings, Store, Palette, Shield, CreditCard,
    Bell, Globe, Save, CheckCircle, Truck, Mail, Phone, MapPin
} from "lucide-react";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("geral");
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        storeName: "DripShop",
        storeEmail: "contato@dripshop.com.br",
        storePhone: "(11) 3333-3333",
        storeAddress: "Rua Example, 123 - São Paulo, SP",
        currency: "BRL",
        language: "pt-BR",
        freeShippingValue: 199,
        shippingPrice: 15,
        shippingTime: "5-7 dias úteis",
        primaryColor: "#000000",
        darkMode: false,
        instagram: "",
        facebook: "",
        twitter: "",
        notifyNewOrder: true,
        notifyLowStock: true,
        notifyNewCustomer: false,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const updateSettings = (key: string, value: string | number | boolean) => {
        setSettings({ ...settings, [key]: value });
    };

    const tabs = [
        { id: "geral", label: "Geral", icon: Store },
        { id: "frete", label: "Frete", icon: Truck },
        { id: "aparencia", label: "Aparência", icon: Palette },
        { id: "contato", label: "Contato", icon: Mail },
        { id: "notificacoes", label: "Notificações", icon: Bell },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Configurações
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie as preferências da sua loja</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-primary text-white py-2.5 px-6 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                    {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "Salvo!" : "Salvar Alterações"}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? "bg-gray-900 text-white shadow-lg"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                    {/* Geral Tab */}
                    {activeTab === "geral" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-bold">Informações da Loja</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Loja</label>
                                    <input 
                                        type="text" 
                                        value={settings.storeName}
                                        onChange={(e) => updateSettings("storeName", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Moeda</label>
                                    <select 
                                        value={settings.currency}
                                        onChange={(e) => updateSettings("currency", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                                    >
                                        <option value="BRL">Real (R$)</option>
                                        <option value="USD">Dólar ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Idioma Padrão</label>
                                    <select 
                                        value={settings.language}
                                        onChange={(e) => updateSettings("language", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                                    >
                                        <option value="pt-BR">Português (Brasil)</option>
                                        <option value="en-US">English (US)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Frete Tab */}
                    {activeTab === "frete" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-bold">Configurações de Frete</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor para Frete Grátis</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                                        <input 
                                            type="number" 
                                            value={settings.freeShippingValue}
                                            onChange={(e) => updateSettings("freeShippingValue", Number(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor do Frete</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                                        <input 
                                            type="number" 
                                            value={settings.shippingPrice}
                                            onChange={(e) => updateSettings("shippingPrice", Number(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Prazo de Entrega</label>
                                    <input 
                                        type="text" 
                                        value={settings.shippingTime}
                                        onChange={(e) => updateSettings("shippingTime", e.target.value)}
                                        placeholder="Ex: 5-7 dias úteis"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aparência Tab */}
                    {activeTab === "aparencia" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-bold">Customização Visual</h2>
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium">Modo Escuro</p>
                                    <p className="text-xs text-gray-500">Ativar tema escuro na loja</p>
                                </div>
                                <button 
                                    onClick={() => updateSettings("darkMode", !settings.darkMode)}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.darkMode ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Cor de Destaque</label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { color: "#000000", name: "Preto" },
                                        { color: "#3B82F6", name: "Azul" },
                                        { color: "#EF4444", name: "Vermelho" },
                                        { color: "#10B981", name: "Verde" },
                                        { color: "#8B5CF6", name: "Roxo" },
                                        { color: "#F59E0B", name: "Laranja" },
                                    ].map((item) => (
                                        <button
                                            key={item.color}
                                            onClick={() => updateSettings("primaryColor", item.color)}
                                            className={`w-12 h-12 rounded-xl border-2 transition-all ${
                                                settings.primaryColor === item.color 
                                                    ? "border-gray-900 scale-110" 
                                                    : "border-transparent hover:scale-105"
                                            }`}
                                            style={{ backgroundColor: item.color }}
                                            title={item.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contato Tab */}
                    {activeTab === "contato" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-bold">Informações de Contato</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email de Contato</label>
                                    <input 
                                        type="email" 
                                        value={settings.storeEmail}
                                        onChange={(e) => updateSettings("storeEmail", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                                    <input 
                                        type="tel" 
                                        value={settings.storePhone}
                                        onChange={(e) => updateSettings("storePhone", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço</label>
                                    <input 
                                        type="text" 
                                        value={settings.storeAddress}
                                        onChange={(e) => updateSettings("storeAddress", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">Redes Sociais</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 font-bold text-xs">IG</div>
                                        <input 
                                            type="text" 
                                            value={settings.instagram}
                                            onChange={(e) => updateSettings("instagram", e.target.value)}
                                            placeholder="https://instagram.com/dripshop"
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs">FB</div>
                                        <input 
                                            type="text" 
                                            value={settings.facebook}
                                            onChange={(e) => updateSettings("facebook", e.target.value)}
                                            placeholder="https://facebook.com/dripshop"
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xs">X</div>
                                        <input 
                                            type="text" 
                                            value={settings.twitter}
                                            onChange={(e) => updateSettings("twitter", e.target.value)}
                                            placeholder="https://x.com/dripshop"
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notificações Tab */}
                    {activeTab === "notificacoes" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-lg font-bold">Preferências de Notificações</h2>
                            
                            <div className="space-y-3">
                                {[
                                    { key: "notifyNewOrder", label: "Novo pedido", description: "Receber notificação quando um novo pedido for realizado" },
                                    { key: "notifyLowStock", label: "Estoque baixo", description: "Receber alerta quando um produto estiver com estoque baixo" },
                                    { key: "notifyNewCustomer", label: "Novo cliente", description: "Receber notificação quando um novo cliente se cadastrar" },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="text-sm font-medium">{item.label}</p>
                                            <p className="text-xs text-gray-500">{item.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => updateSettings(item.key, !settings[item.key as keyof typeof settings])}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${
                                                settings[item.key as keyof typeof settings] ? 'bg-primary' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                                settings[item.key as keyof typeof settings] ? 'right-1' : 'left-1'
                                            }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
