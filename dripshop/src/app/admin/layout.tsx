"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Package, ShoppingCart, Tag, FolderOpen,
    Users, Settings, LogOut, Menu, X, ChevronRight,
    Bell, Search, TrendingUp, DollarSign, ShoppingBag, Eye
} from "lucide-react";

const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produtos", label: "Produtos", icon: Package },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
    { href: "/admin/categorias", label: "Categorias", icon: Tag },
    { href: "/admin/colecoes", label: "Coleções", icon: FolderOpen },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:w-72 lg:min-h-screen flex-col bg-white text-gray-900 shadow-xl border-r border-gray-200">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-lg font-black text-white">D</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                DRIPSHOP
                            </h1>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                Painel Admin
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <div className="px-3 space-y-1">
                        <p className="px-4 py-2 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                            Menu Principal
                        </p>
                        {adminLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? "bg-gray-900 text-white shadow-lg"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{link.label}</span>
                                    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all group"
                    >
                        <Eye className="w-5 h-5" />
                        <span>Ver Loja</span>
                        <span className="ml-auto text-xs opacity-50">↗</span>
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer">
                        <LogOut className="w-5 h-5" />
                        <span>Sair</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white text-gray-900 flex flex-col animate-slide-in">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                            <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                                    <span className="text-lg font-black text-white">D</span>
                                </div>
                                <div>
                                    <h1 className="text-lg font-extrabold">DRIPSHOP</h1>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Admin</span>
                                </div>
                            </Link>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                            {adminLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                            active 
                                                ? "bg-gray-900 text-white" 
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-gray-200">
                            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                <LogOut className="w-5 h-5" />
                                <span>Voltar à Loja</span>
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            
                            <div className="hidden sm:flex items-center gap-2 text-sm">
                                <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
                                    Admin
                                </Link>
                                {pathname !== "/admin" && (
                                    <>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                        <span className="text-gray-900 font-medium capitalize">
                                            {pathname.split('/').pop()?.replace('-', ' ')}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-4">
                            <div className="hidden md:block relative">
                                {searchOpen ? (
                                    <div className="animate-fade-in">
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            className="w-64 px-4 py-2.5 pl-10 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            autoFocus
                                            onBlur={() => setSearchOpen(false)}
                                        />
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setSearchOpen(true)}
                                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <Search className="w-5 h-5 text-gray-500" />
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <button 
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative"
                                >
                                    <Bell className="w-5 h-5 text-gray-500" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                </button>
                                
                                {notificationsOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-4 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-900">Notificações</h3>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {[
                                                { title: "Novo pedido #1234", desc: "Cliente: João Silva - R$ 299,90", time: "2 min", unread: true },
                                                { title: "Estoque baixo", desc: "Camiseta Self-Data (P)", time: "1 hora", unread: true },
                                                { title: "Pagamento confirmado", desc: "Pedido #1233 foi pago", time: "3 horas", unread: false },
                                            ].map((notif, i) => (
                                                <div key={i} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-primary/5' : ''}`}>
                                                    <div className="flex items-start gap-3">
                                                        {notif.unread && <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                                            <p className="text-xs text-gray-500 truncate">{notif.desc}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 bg-gray-50 text-center">
                                            <button className="text-sm text-primary font-medium hover:underline">
                                                Ver todas
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                                <div className="hidden lg:block text-right">
                                    <p className="text-sm font-medium text-gray-900">Admin</p>
                                    <p className="text-xs text-gray-500">administrador</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl flex items-center justify-center text-sm font-bold">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 bg-gray-50">
                    <div className="animate-fade-in space-y-6">
                        {children}
                    </div>
                </main>
            </div>

            <style jsx global>{`
                @keyframes slide-in {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
