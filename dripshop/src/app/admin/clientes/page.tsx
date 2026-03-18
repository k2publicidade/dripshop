"use client";

import { useState } from "react";
import { Search, Users, Mail, ShoppingCart, Calendar, X, Eye, Edit2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCustomerStore, Customer } from "@/store/customerStore";

export default function AdminClientesPage() {
  const { customers, toggleActive } = useCustomerStore();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          Clientes
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {customers.length} clientes • {customers.filter(c => c.isActive).length} ativos
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Clientes", value: customers.length, color: "bg-blue-50 text-blue-600" },
          { label: "Ativos", value: customers.filter(c => c.isActive).length, color: "bg-green-50 text-green-600" },
          { label: "Total Pedidos", value: customers.reduce((a, c) => a + c.totalOrders, 0), color: "bg-purple-50 text-purple-600" },
          { label: "Receita Total", value: formatPrice(customers.reduce((a, c) => a + c.totalSpent, 0)), color: "bg-yellow-50 text-yellow-600", isValue: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
              {i === 0 ? <Users className="w-5 h-5" /> : i === 1 ? <Users className="w-5 h-5" /> : i === 2 ? <ShoppingCart className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Cliente</th>
                <th className="text-left px-4 lg:px-6 py-3 font-medium hidden md:table-cell">Telefone</th>
                <th className="text-center px-4 lg:px-6 py-3 font-medium">Pedidos</th>
                <th className="text-right px-4 lg:px-6 py-3 font-medium">Total Gasto</th>
                <th className="text-center px-4 lg:px-6 py-3 font-medium hidden sm:table-cell">Status</th>
                <th className="text-right px-4 lg:px-6 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{customer.phone}</td>
                  <td className="px-4 lg:px-6 py-4 text-center text-sm font-medium">{customer.totalOrders}</td>
                  <td className="px-4 lg:px-6 py-4 text-right text-sm font-bold">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-4 lg:px-6 py-4 text-center hidden sm:table-cell">
                    <button
                      onClick={() => toggleActive(customer.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        customer.isActive 
                          ? "bg-green-50 text-green-700 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {customer.isActive ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedCustomer(null)} />
          <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-fade-in-up h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {selectedCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-sm text-gray-500">Cliente desde {formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium">{selectedCustomer.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Telefone</p>
                  <p className="text-sm font-medium">{selectedCustomer.phone}</p>
                </div>
                {selectedCustomer.cpf && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">CPF</p>
                    <p className="text-sm font-medium">{selectedCustomer.cpf}</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <button
                    onClick={() => toggleActive(selectedCustomer.id)}
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      selectedCustomer.isActive 
                        ? "bg-green-50 text-green-700" 
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {selectedCustomer.isActive ? "Ativo" : "Inativo"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-700">{selectedCustomer.totalOrders}</p>
                  <p className="text-xs text-blue-600">Pedidos</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-700">{formatPrice(selectedCustomer.totalSpent)}</p>
                  <p className="text-xs text-green-600">Total Gasto</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-purple-700">
                    {selectedCustomer.totalOrders > 0 
                      ? formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders) 
                      : formatPrice(0)}
                  </p>
                  <p className="text-xs text-purple-600">Ticket Médio</p>
                </div>
              </div>

              {selectedCustomer.lastOrderDate && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Último Pedido</p>
                  <p className="text-sm font-medium">{formatDate(selectedCustomer.lastOrderDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
