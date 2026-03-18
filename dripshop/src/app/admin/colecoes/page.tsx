"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, FolderOpen, X, Save, Star, Package } from "lucide-react";
import { useCollectionStore, Collection } from "@/store/collectionStore";

export default function AdminColecoesPage() {
  const { collections, addCollection, updateCollection, deleteCollection, toggleActive, toggleFeatured } = useCollectionStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
    isFeatured: false,
  });

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCollection) {
      updateCollection(editingCollection.id, formData);
    } else {
      addCollection(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", image: "", isActive: true, isFeatured: false });
    setEditingCollection(null);
    setShowForm(false);
  };

  const handleEdit = (collection: Collection) => {
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || "",
      image: collection.image || "",
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
    });
    setEditingCollection(collection);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCollection(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Coleções
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {collections.length} coleções • {collections.filter(c => c.isActive).length} ativas
          </p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Coleção
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Coleções", value: collections.length, color: "bg-blue-50 text-blue-600" },
          { label: "Ativas", value: collections.filter(c => c.isActive).length, color: "bg-green-50 text-green-600" },
          { label: "Em Destaque", value: collections.filter(c => c.isFeatured).length, color: "bg-yellow-50 text-yellow-600" },
          { label: "Total Produtos", value: collections.reduce((acc, c) => acc + c.productCount, 0), color: "bg-purple-50 text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in">
          <h2 className="font-bold mb-4">{editingCollection ? "Editar Coleção" : "Nova Coleção"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Nome da coleção"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="slug"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da coleção"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/image.jpg"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Ativo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Em destaque</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingCollection ? "Salvar Alterações" : "Criar Coleção"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {collections.map((col) => (
          <div 
            key={col.id} 
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
              col.isActive ? "border-gray-100" : "border-gray-100 opacity-60"
            }`}
          >
            <div className="h-28 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center relative overflow-hidden">
              {col.image ? (
                <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
              ) : (
                <FolderOpen className="w-10 h-10 text-white/30" />
              )}
              {col.isFeatured && (
                <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Destaque
                </div>
              )}
              {!col.isActive && (
                <span className="absolute top-3 right-3 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                  Inativa
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">{col.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{col.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {col.productCount} produtos
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => toggleFeatured(col.id)}
                    className={`p-1.5 rounded-lg transition-colors ${col.isFeatured ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-100 text-gray-400'}`}
                    title={col.isFeatured ? "Remover destaque" : "Destacar"}
                  >
                    <Star className={`w-4 h-4 ${col.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => toggleActive(col.id)}
                    className={`p-1.5 rounded-lg transition-colors ${col.isActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-400'}`}
                    title={col.isActive ? "Desativar" : "Ativar"}
                  >
                    {col.isActive ? (
                      <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">●</span>
                    ) : (
                      <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">○</span>
                    )}
                  </button>
                  <button 
                    onClick={() => handleEdit(col)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(col.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excluir Coleção?</h3>
              <p className="text-gray-500 mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
