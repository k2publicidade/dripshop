"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Eye, Filter, MoreHorizontal, Star, Package, X, Save, Image as ImageIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useProductStore, Product } from "@/store/productStore";
import { categories, collections, creators } from "@/lib/data/categories";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-500",
};

export default function AdminProdutosPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleActive, toggleFeatured } = useProductStore();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && p.isActive) || 
      (filterStatus === "inactive" && !p.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedProducts.length === filtered.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filtered.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleBulkDelete = () => {
    selectedProducts.forEach(id => deleteProduct(id));
    setSelectedProducts([]);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Produtos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} produtos cadastrados • {products.filter(p => p.isActive).length} ativos
          </p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Produtos", value: products.length, color: "bg-blue-50 text-blue-600" },
          { label: "Produtos Ativos", value: products.filter(p => p.isActive).length, color: "bg-green-50 text-green-600" },
          { label: "Em Destaque", value: products.filter(p => p.isFeatured).length, color: "bg-yellow-50 text-yellow-600" },
          { label: "Estoque Baixo", value: products.filter(p => p.stock > 0 && p.stock < 20).length, color: "bg-red-50 text-red-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search & Filter bar */}
        <div className="p-4 lg:p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou categoria..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`py-2.5 px-4 text-sm flex items-center gap-2 rounded-xl border transition-colors ${showFilters ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <Filter className="w-4 h-4" /> Filtros
            </button>
            {selectedProducts.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="py-2.5 px-4 text-sm flex items-center gap-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Excluir ({selectedProducts.length})
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 lg:p-5 bg-gray-50 border-b border-gray-100 animate-fade-in">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="all">Todas</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <button 
                onClick={() => { setFilterCategory("all"); setFilterStatus("all"); setSearch(""); }}
                className="ml-auto px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 lg:px-6 py-3 font-medium w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                </th>
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Produto</th>
                <th className="text-left px-4 lg:px-6 py-3 font-medium hidden md:table-cell">Categoria</th>
                <th className="text-right px-4 lg:px-6 py-3 font-medium">Preço</th>
                <th className="text-center px-4 lg:px-6 py-3 font-medium">Estoque</th>
                <th className="text-center px-4 lg:px-6 py-3 font-medium hidden sm:table-cell">Status</th>
                <th className="text-right px-4 lg:px-6 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group">
                  <td className="px-4 lg:px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary" 
                    />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                        <img
                          src={product.images[0] || "/mockup.jpg"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.isFeatured && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-current" /> Destaque
                            </span>
                          )}
                          {product.originalPrice && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                            </span>
                          )}
                          {product.isNew && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-semibold">
                              Novo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <div>
                      <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <p className="text-[11px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`text-sm font-bold ${
                        product.stock === 0 ? "text-red-600" : 
                        product.stock < 20 ? "text-yellow-600" : "text-green-600"
                      }`}>
                        {product.stock}
                      </span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            product.stock === 0 ? "bg-red-500" : 
                            product.stock < 20 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-center hidden sm:table-cell">
                    <button 
                      onClick={() => toggleActive(product.id)}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                        product.isActive 
                          ? "bg-green-50 text-green-700 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      {product.isActive ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-2 rounded-lg transition-colors ${product.isFeatured ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-100 text-gray-400'}`}
                        title={product.isFeatured ? "Remover destaque" : "Destacar"}
                      >
                        <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou buscar por outro termo</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{filtered.length}</span> de <span className="font-medium text-gray-900">{products.length}</span> produtos
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excluir Produto?</h3>
              <p className="text-gray-500 mb-6">Esta ação não pode ser desfeita. O produto será removido permanentemente.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
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

// Product Modal Component
function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addProduct, updateProduct } = useProductStore();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    description: product?.description || "",
    category: product?.category || "camisetas",
    collection: product?.collection || "",
    stock: product?.stock || 0,
    isNew: product?.isNew || false,
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
    sizes: product?.sizes || ["P", "M", "G", "GG"],
    colors: product?.colors || [{ name: "Preto", hex: "#000000" }],
  });
  const [imageUrl, setImageUrl] = useState(product?.images[0] || "/mockup.jpg");
  const [saving, setSaving] = useState(false);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const productData = {
      name: formData.name,
      slug: generateSlug(formData.name),
      price: Number(formData.price),
      originalPrice: formData.originalPrice > 0 ? Number(formData.originalPrice) : undefined,
      description: formData.description,
      images: [imageUrl],
      category: formData.category,
      collection: formData.collection || undefined,
      colors: formData.colors,
      sizes: formData.sizes,
      isNew: formData.isNew,
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
      stock: Number(formData.stock),
    };

    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }

    setSaving(false);
    onClose();
  };

  const availableSizes = ["P", "M", "G", "GG", "XG", "Único"];
  const toggleSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-fade-in-up h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            {product ? "Editar Produto" : "Novo Produto"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/mockup.jpg"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Camiseta Oversized"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço Original</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do produto..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Category & Collection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coleção</label>
              <select
                value={formData.collection}
                onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              >
                <option value="">Nenhuma</option>
                {collections.map(col => (
                  <option key={col.id} value={col.slug}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estoque *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.sizes.includes(size)
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Novo lançamento</span>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Ativo</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {product ? "Salvar Alterações" : "Criar Produto"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
