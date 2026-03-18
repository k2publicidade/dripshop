"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const accountLinks = [
    { href: "/conta", label: "Meus Dados", icon: User },
    { href: "/conta/pedidos", label: "Meus Pedidos", icon: Package },
    { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
    { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
];

export default function ContaLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-white">
            <div className="container py-12">
                <div className="mb-12 border-b border-gray-200 pb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Minha Conta
                    </h1>
                    <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
                        Olá, <span className="font-black text-black">{user?.name || user?.email || "visitante"}</span>
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <nav className="bg-white border border-gray-300">
                            {accountLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b border-gray-200 last:border-b-0 ${isActive
                                                ? "bg-black text-white"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-black hover:pl-7"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="flex-1">{link.label}</span>
                                        <ChevronRight className="w-4 h-4 opacity-40" />
                                    </Link>
                                );
                            })}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all border-t border-gray-200 w-full"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sair</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0">{children}</div>
                </div>
            </div>
        </div>
    );
}
