"use client";

import { useState } from "react";
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface MockOrder {
    id: string;
    orderNumber: string;
    date: string;
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    total: number;
    items: { name: string; image: string; size: string; color: string; quantity: number; price: number }[];
}

const statusConfig = {
    PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    PROCESSING: { label: "Em preparo", color: "bg-indigo-100 text-indigo-800", icon: Package },
    SHIPPED: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: Truck },
    DELIVERED: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
    CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
};

const mockOrders: MockOrder[] = [
    {
        id: "1",
        orderNumber: "DRP-20250301-001",
        date: "2025-03-01",
        status: "DELIVERED",
        total: 239.7,
        items: [
            { name: "Camiseta Oversized Self-Data", image: "", size: "G", color: "Preto", quantity: 1, price: 119.9 },
            { name: "Moletom Dark Mood", image: "", size: "M", color: "Cinza", quantity: 1, price: 119.8 },
        ],
    },
    {
        id: "2",
        orderNumber: "DRP-20250310-002",
        date: "2025-03-10",
        status: "SHIPPED",
        total: 89.9,
        items: [
            { name: "Camiseta Street Collection", image: "", size: "M", color: "Branco", quantity: 1, price: 89.9 },
        ],
    },
    {
        id: "3",
        orderNumber: "DRP-20250315-003",
        date: "2025-03-15",
        status: "PENDING",
        total: 349.7,
        items: [
            { name: "Moletom Astrocore com Capuz", image: "", size: "GG", color: "Preto", quantity: 1, price: 199.9 },
            { name: "Caneca Metaru", image: "", size: "Único", color: "Branco", quantity: 2, price: 74.9 },
        ],
    },
];

export default function PedidosPage() {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-300 p-6 lg:p-8">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-8" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Meus Pedidos
                </h2>

                {mockOrders.length === 0 ? (
                    <div className="py-12 text-center border border-gray-200 bg-gray-50">
                        <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4">
                            <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2">Nenhum pedido encontrado</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Faça sua primeira compra!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mockOrders.map((order) => {
                            const status = statusConfig[order.status];
                            const StatusIcon = status.icon;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <div key={order.id} className="border-2 border-gray-200 rounded-none transition-all hover:border-black">
                                    <button
                                        className="w-full flex items-center justify-between p-6 text-left"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                                                <StatusIcon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-black uppercase tracking-widest text-sm">{order.orderNumber}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                    {new Date(order.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-none ${status.color}`}>
                                                {status.label}
                                            </span>
                                            <span className="font-black text-sm hidden sm:block">{formatPrice(order.total)}</span>
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t-2 border-gray-200 p-6 bg-gray-50 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                                            <div className="space-y-4">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 bg-white border border-gray-200 p-4">
                                                        <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={item.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100"}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-black uppercase tracking-widest truncate">{item.name}</p>
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                                Tam: {item.size} | Cor: {item.color} | Qtd: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm font-black">{formatPrice(item.price)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Total do pedido</span>
                                                <span className="text-xl font-black">{formatPrice(order.total)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
