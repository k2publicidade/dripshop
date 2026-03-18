"use client";

import { DollarSign, Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Package as PackageIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const stats = [
    { label: "Receita Total", value: formatPrice(45890), change: "+12.5%", trend: "up", icon: DollarSign, color: "from-green-500 to-emerald-600" },
    { label: "Pedidos", value: "156", change: "+8.2%", trend: "up", icon: ShoppingCart, color: "from-blue-500 to-indigo-600" },
    { label: "Produtos Ativos", value: "234", change: "+3", trend: "up", icon: Package, color: "from-purple-500 to-violet-600" },
    { label: "Clientes", value: "1.2k", change: "+5.1%", trend: "up", icon: Users, color: "from-orange-500 to-red-600" },
];

const recentOrders = [
    { id: "DRP-001", customer: "João Silva", total: 239.7, status: "DELIVERED", date: "17/03/2025", items: 3 },
    { id: "DRP-002", customer: "Maria Santos", total: 119.9, status: "SHIPPED", date: "16/03/2025", items: 1 },
    { id: "DRP-003", customer: "Pedro Costa", total: 349.7, status: "PROCESSING", date: "16/03/2025", items: 2 },
    { id: "DRP-004", customer: "Ana Oliveira", total: 89.9, status: "PENDING", date: "15/03/2025", items: 1 },
    { id: "DRP-005", customer: "Lucas Lima", total: 459.8, status: "CONFIRMED", date: "15/03/2025", items: 4 },
];

const topProducts = [
    { name: "Camiseta Oversized Self-Data", sold: 48, revenue: 5751.2, image: "/mockup.jpg" },
    { name: "Moletom Dark Mood com Capuz", sold: 35, revenue: 6996.5, image: "/mockup.jpg" },
    { name: "Camiseta Street Collection", sold: 32, revenue: 2876.8, image: "/mockup.jpg" },
    { name: "Caneca Metaru", sold: 28, revenue: 1117.2, image: "/mockup.jpg" },
    { name: "Moletom Astrocore", sold: 24, revenue: 4797.6, image: "/mockup.jpg" },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
    PENDING: { color: "text-yellow-700", bg: "bg-yellow-50", icon: Clock },
    CONFIRMED: { color: "text-blue-700", bg: "bg-blue-50", icon: CheckCircle },
    PROCESSING: { color: "text-indigo-700", bg: "bg-indigo-50", icon: PackageIcon },
    SHIPPED: { color: "text-purple-700", bg: "bg-purple-50", icon: PackageIcon },
    DELIVERED: { color: "text-green-700", bg: "bg-green-50", icon: CheckCircle },
    CANCELLED: { color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    PROCESSING: "Em preparo",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
};

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Bem-vindo de volta! Veja como está sua loja hoje.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/produtos" className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        + Novo Produto
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    const isUp = stat.trend === "up";
                    return (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 lg:p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                Pedidos Recentes
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">Últimos 5 pedidos realizados</p>
                        </div>
                        <Link href="/admin/pedidos" className="text-sm text-primary font-medium hover:underline">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="text-left px-5 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedido</th>
                                    <th className="text-left px-5 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="text-left px-5 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Itens</th>
                                    <th className="text-left px-5 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-5 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => {
                                    const status = statusConfig[order.status];
                                    const StatusIcon = status.icon;
                                    return (
                                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer">
                                            <td className="px-5 lg:px-6 py-4">
                                                <span className="text-sm font-mono font-semibold text-gray-900">{order.id}</span>
                                                <p className="text-xs text-gray-400">{order.date}</p>
                                            </td>
                                            <td className="px-5 lg:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {order.customer.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 lg:px-6 py-4 hidden sm:table-cell">
                                                <span className="text-sm text-gray-500">{order.items} item{order.items > 1 ? 's' : ''}</span>
                                            </td>
                                            <td className="px-5 lg:px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {statusLabels[order.status]}
                                                </span>
                                            </td>
                                            <td className="px-5 lg:px-6 py-4 text-right">
                                                <span className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 lg:p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                            Produtos Mais Vendidos
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5"> ranking do mês</p>
                    </div>
                    <div className="p-5 lg:p-6 space-y-4">
                        {topProducts.map((product, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="relative">
                                    <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full text-sm font-bold text-gray-600 group-hover:from-primary group-hover:to-primary/80 group-hover:text-white transition-all">
                                        {i + 1}
                                    </span>
                                    {i === 0 && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <span className="text-[8px]">🏆</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.sold} vendas</p>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{formatPrice(product.revenue)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                        <Link href="/admin/produtos" className="text-sm text-primary font-medium hover:underline">
                            Ver inventário completo →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Adicionar Produto", href: "/admin/produtos", icon: Package, color: "bg-blue-50 text-blue-600" },
                    { label: "Ver Pedidos", href: "/admin/pedidos", icon: ShoppingCart, color: "bg-green-50 text-green-600" },
                    { label: "Gerenciar Coleções", href: "/admin/colecoes", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
                    { label: "Configurações", href: "/admin/configuracoes", icon: DollarSign, color: "bg-orange-50 text-orange-600" },
                ].map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={i}
                            href={action.href}
                            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{action.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
