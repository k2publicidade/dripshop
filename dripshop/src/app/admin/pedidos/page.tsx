"use client";

import { useState } from "react";
import { Search, Eye, Package, Truck, CheckCircle, Clock, XCircle, X, MessageSquare, ExternalLink, Copy, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useOrderStore, Order, OrderStatus } from "@/store/orderStore";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: { label: "Pendente", color: "text-yellow-700", bg: "bg-yellow-50", icon: Clock },
  CONFIRMED: { label: "Confirmado", color: "text-blue-700", bg: "bg-blue-50", icon: CheckCircle },
  PROCESSING: { label: "Em preparo", color: "text-indigo-700", bg: "bg-indigo-50", icon: Package },
  SHIPPED: { label: "Enviado", color: "text-purple-700", bg: "bg-purple-50", icon: Truck },
  DELIVERED: { label: "Entregue", color: "text-green-700", bg: "bg-green-50", icon: CheckCircle },
  CANCELLED: { label: "Cancelado", color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

const allStatuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminPedidosPage() {
  const { orders, updateOrderStatus, updateTrackingCode, addOrderNote } = useOrderStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleUpdateTracking = () => {
    if (selectedOrder && trackingCode) {
      updateTrackingCode(selectedOrder.id, trackingCode);
      setSelectedOrder({ ...selectedOrder, trackingCode });
      setTrackingCode("");
    }
  };

  const handleAddNote = () => {
    if (selectedOrder && orderNote) {
      addOrderNote(selectedOrder.id, orderNote);
      setSelectedOrder({ ...selectedOrder, notes: orderNote });
      setOrderNote("");
    }
  };

  const copyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          Pedidos
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders.length} pedidos • {orders.filter(o => o.status === 'PENDING').length} pendentes
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Pendentes", count: orders.filter((o) => o.status === "PENDING").length, color: "text-yellow-600 bg-yellow-50", icon: Clock },
          { label: "Confirmados", count: orders.filter((o) => o.status === "CONFIRMED").length, color: "text-blue-600 bg-blue-50", icon: CheckCircle },
          { label: "Em preparo", count: orders.filter((o) => o.status === "PROCESSING").length, color: "text-indigo-600 bg-indigo-50", icon: Package },
          { label: "Enviados", count: orders.filter((o) => o.status === "SHIPPED").length, color: "text-purple-600 bg-purple-50", icon: Truck },
          { label: "Entregues", count: orders.filter((o) => o.status === "DELIVERED").length, color: "text-green-600 bg-green-50", icon: CheckCircle },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por pedido ou cliente..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
          >
            <option value="">Todos os status</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Pedido</th>
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Cliente</th>
                <th className="text-center px-4 lg:px-6 py-3 font-medium hidden sm:table-cell">Itens</th>
                <th className="text-right px-4 lg:px-6 py-3 font-medium">Total</th>
                <th className="text-center px-4 lg:px-6 py-3 font-medium">Status</th>
                <th className="text-right px-4 lg:px-6 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <p className="text-sm font-mono font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <p className="text-sm font-medium">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.email}</p>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-center hidden sm:table-cell">
                      <span className="text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-fade-in-up h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold">Pedido {selectedOrder.orderNumber}</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Status */}
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status do Pedido</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status do Pagamento</label>
                  <span className={`inline-block px-4 py-2.5 rounded-xl text-sm font-medium ${
                    selectedOrder.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' :
                    selectedOrder.paymentStatus === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {selectedOrder.paymentStatus === 'PAID' ? 'Pago' :
                     selectedOrder.paymentStatus === 'PENDING' ? 'Pendente' :
                     selectedOrder.paymentStatus === 'REFUNDED' ? 'Estornado' : 'Falhou'}
                  </span>
                </div>
              </div>

              {/* Tracking */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-xs font-medium text-gray-500 mb-2">Código de Rastreio</label>
                {selectedOrder.trackingCode ? (
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono">{selectedOrder.trackingCode}</code>
                    <button 
                      onClick={() => copyTrackingCode(selectedOrder.trackingCode!)}
                      className="p-2 hover:bg-white rounded-lg"
                      title="Copiar"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    <a 
                      href={`https://rastreamento.correios.com.br/${selectedOrder.trackingCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white rounded-lg"
                      title="Rastrear"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </a>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder="Código de rastreio"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                    />
                    <button 
                      onClick={handleUpdateTracking}
                      disabled={!trackingCode}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
                    >
                      Adicionar
                    </button>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-bold mb-3">Cliente</h3>
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <p><span className="text-gray-500">Nome:</span> {selectedOrder.customer.name}</p>
                  <p><span className="text-gray-500">Email:</span> {selectedOrder.customer.email}</p>
                  <p><span className="text-gray-500">Telefone:</span> {selectedOrder.customer.phone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-bold mb-3">Endereço de Entrega</h3>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.state}</p>
                  <p>CEP: {selectedOrder.shippingAddress.zipCode}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold mb-3">Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.size} • {item.color} • Qtd: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="p-4 bg-gray-900 rounded-xl text-white">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Frete</span>
                  <span>{formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Observações
                </h3>
                {selectedOrder.notes ? (
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Adicionar observação..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                    />
                    <button 
                      onClick={handleAddNote}
                      disabled={!orderNote}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
                    >
                      Salvar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
