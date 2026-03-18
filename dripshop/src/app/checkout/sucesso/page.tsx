"use client";

import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { useState, useEffect } from "react";

export default function CheckoutSucessoPage() {
    const [orderNumber, setOrderNumber] = useState("");

    useEffect(() => {
        setOrderNumber(`DRP-${Date.now().toString().slice(-8)}`);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="max-w-lg w-full text-center">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 lg:p-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Pedido Confirmado! 🎉
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Obrigado pela sua compra! Seu pedido foi recebido e está sendo processado.
                    </p>

                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Número do pedido</p>
                        <p className="text-xl font-bold font-mono tracking-wider">{orderNumber}</p>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 mb-8">
                        <div className="flex items-center gap-3 justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>Você receberá um email com o rastreamento</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/conta/pedidos" className="btn-primary flex-1 py-3.5 text-sm">
                            <span className="flex items-center justify-center gap-2">
                                <Package className="w-4 h-4" /> Acompanhar Pedido
                            </span>
                        </Link>
                        <Link href="/" className="btn-secondary flex-1 py-3.5 text-sm">
                            <span className="flex items-center justify-center gap-2">
                                <Home className="w-4 h-4" /> Voltar à Loja
                            </span>
                        </Link>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    Em caso de dúvidas, entre em contato:{" "}
                    <Link href="/p/fale-conosco" className="underline hover:text-gray-600">suporte@dripshop.com.br</Link>
                </p>
            </div>
        </div>
    );
}
