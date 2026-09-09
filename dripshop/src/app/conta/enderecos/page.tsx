"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Edit2, Trash2, Check, X } from "lucide-react";

interface Address {
    id: string;
    label: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
}



const emptyAddress = { label: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "", isDefault: false };

export default function EnderecosPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [error,setError]=useState('');
    const load=async()=>{try{const r=await fetch('/api/addresses');const b=await r.json();if(!r.ok)throw new Error(b.error?.message);setAddresses(b.data);}catch{setError('Não foi possível carregar seus endereços.');}};
    useEffect(()=>{void load();},[]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyAddress);
    const [editingId, setEditingId] = useState<string | null>(null);

    const updateField = (field: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const mutate=async(method:string,body:unknown)=>{setError('');try{const r=await fetch('/api/addresses',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const b=await r.json();if(!r.ok)throw new Error(b.error?.message||'Não foi possível salvar.');await load();return true;}catch(e){setError(e instanceof Error?e.message:'Erro de conexão');return false;}};
    const handleAdd=async(e:React.FormEvent)=>{e.preventDefault();if(await mutate(editingId?'PUT':'POST',{...form,...(editingId?{id:editingId}:{})})){setForm(emptyAddress);setEditingId(null);setShowForm(false);}};
    const handleRemove=(id:string)=>mutate('DELETE',{id});
    const handleSetDefault=(id:string)=>mutate('PATCH',{id});

    return (
        <div className="space-y-6">{error&&<p role="alert" className="text-gray-700">{error}</p>}
            <div className="bg-white border border-gray-300 p-6 lg:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-widest" style={{ fontFamily: "Manrope, sans-serif" }}>
                        Meus Endereços
                    </h2>
                    <button
                        onClick={() => { setEditingId(null);setForm(emptyAddress);setShowForm(!showForm); }}
                        className="btn-primary py-3 px-6 text-xs uppercase font-bold tracking-widest"
                    >
                        {showForm ? (
                            <span className="flex items-center gap-2"><X className="w-4 h-4" /> Cancelar</span>
                        ) : (
                            <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Novo endereço</span>
                        )}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleAdd} className="mb-10 p-6 lg:p-8 bg-white border border-gray-300 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                        <h3 className="font-black uppercase tracking-widest mb-6">{editingId?'Editar endereço':'Adicionar endereço'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Apelido</label>
                                <input
                                    type="text"
                                    value={form.label}
                                    onChange={(e) => updateField("label", e.target.value)}
                                    placeholder="Ex: Casa, Trabalho"
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">CEP</label>
                                <input
                                    type="text"
                                    value={form.zipCode}
                                    onChange={(e) => updateField("zipCode", e.target.value)}
                                    placeholder="00000-000"
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Rua</label>
                                <input
                                    type="text"
                                    value={form.street}
                                    onChange={(e) => updateField("street", e.target.value)}
                                    placeholder="Rua, Avenida, Travessa..."
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Número</label>
                                <input
                                    type="text"
                                    value={form.number}
                                    onChange={(e) => updateField("number", e.target.value)}
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Complemento</label>
                                <input
                                    type="text"
                                    value={form.complement}
                                    onChange={(e) => updateField("complement", e.target.value)}
                                    placeholder="Apto, Bloco..."
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Bairro</label>
                                <input
                                    type="text"
                                    value={form.neighborhood}
                                    onChange={(e) => updateField("neighborhood", e.target.value)}
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Cidade</label>
                                <input
                                    type="text"
                                    value={form.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Estado</label>
                                <select
                                    value={form.state}
                                    onChange={(e) => updateField("state", e.target.value)}
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
                                >
                                    <option value="">Selecione</option>
                                    {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button type="submit" className="btn-primary py-3 px-6 text-xs uppercase font-bold tracking-widest">
                                Salvar endereço
                            </button>
                        </div>
                    </form>
                )}

                {addresses.length === 0 ? (
                    <div className="py-12 text-center border border-gray-200 bg-gray-50">
                        <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-xs uppercase font-bold tracking-widest text-gray-500">Nenhum endereço cadastrado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`relative p-6 border-2 transition-all ${addr.isDefault ? "border-black bg-gray-50" : "border-gray-200 hover:border-black"
                                    }`}
                            >
                                {addr.isDefault && (
                                    <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase bg-black text-white px-3 py-1.5">
                                        Padrão
                                    </span>
                                )}
                                <h3 className="font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {addr.label || "Endereço"}
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600 mb-6">
                                    <p>
                                        {addr.street}, {addr.number}
                                        {addr.complement && ` - ${addr.complement}`}
                                    </p>
                                    <p>
                                        {addr.neighborhood} - {addr.city}/{addr.state}
                                    </p>
                                    <p className="text-gray-500 font-bold">CEP: {addr.zipCode}</p>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                    {!addr.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black font-bold flex items-center gap-1 transition-colors"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Tornar padrão
                                        </button>
                                    )}
                                    <button onClick={() => {setEditingId(addr.id);setForm({...addr,complement:addr.complement||''});setShowForm(true);window.scrollTo({top:0,behavior:'smooth'});}} className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black font-bold flex items-center gap-1 transition-colors ml-auto border-r border-gray-200 pr-4">
                                        <Edit2 className="w-3.5 h-3.5" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleRemove(addr.id)}
                                        className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-700 font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

