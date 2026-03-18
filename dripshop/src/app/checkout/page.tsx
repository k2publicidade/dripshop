"use client";

import { ArrowLeft, ArrowRight, Check, Lock, CreditCard, Truck, MapPin, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "dados" | "entrega" | "pagamento";

const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "dados", label: "Dados", icon: MapPin },
    { key: "entrega", label: "Entrega", icon: Truck },
    { key: "pagamento", label: "Pagamento", icon: CreditCard },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [currentStep, setCurrentStep] = useState<Step>("dados");
    const total = getTotalPrice();
    const freeShipping = total >= 199;
    const shippingCost = freeShipping ? 0 : 19.9;
    const finalTotal = total + shippingCost;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        paymentMethod: "credit",
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvv: "",
        installments: "1",
    });

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const stepIndex = steps.findIndex((s) => s.key === currentStep);

    const goNext = () => {
        if (stepIndex < steps.length - 1) {
            setCurrentStep(steps[stepIndex + 1].key);
        }
    };

    const goBack = () => {
        if (stepIndex > 0) {
            setCurrentStep(steps[stepIndex - 1].key);
        }
    };

    const handleFinalize = () => {
        clearCart();
        router.push("/checkout/sucesso");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Carrinho vazio
                    </h1>
                    <p className="text-gray-500 mb-6">Adicione produtos antes de ir ao checkout.</p>
                    <Link href="/" className="btn-primary px-8 py-3">
                        Explorar produtos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="container flex items-center justify-between">
                    <Link href="/carrinho" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Voltar ao carrinho
                    </Link>
                    <Link href="/" className="text-xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        DRIPSHOP
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Lock className="w-3 h-3" /> Compra Segura
                    </div>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="bg-white border-b border-gray-200">
                <div className="container py-6">
                    <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const isActive = i === stepIndex;
                            const isCompleted = i < stepIndex;
                            return (
                                <div key={step.key} className="flex items-center flex-1">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 transition-all ${isActive ? "border-black bg-black text-white" : isCompleted ? "border-black bg-white text-black" : "border-gray-200 bg-gray-50 text-gray-400"}`}>
                                            {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-widest font-bold hidden sm:block ${isActive ? "text-black" : isCompleted ? "text-black" : "text-gray-400"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`h-px w-8 mx-2 ${i < stepIndex ? "bg-black" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Area */}
                    <div className="flex-1">
                        {currentStep === "dados" && (
                            <div className="bg-white border border-gray-200 p-6 lg:p-10 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                                <h2 className="text-xl font-black mb-8 uppercase tracking-widest" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                    Dados Pessoais
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nome completo</label>
                                        <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Seu nome" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                        <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="seu@email.com" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CPF</label>
                                        <input type="text" value={formData.cpf} onChange={(e) => updateField("cpf", e.target.value)} placeholder="000.000.000-00" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Telefone</label>
                                        <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(11) 99999-9999" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-8">
                                    <button onClick={goNext} className="btn-primary px-8 py-3">
                                        <span className="flex items-center gap-2">Continuar <ArrowRight className="w-4 h-4" /></span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === "entrega" && (
                            <div className="bg-white border border-gray-200 p-6 lg:p-10 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                                <h2 className="text-xl font-black mb-8 uppercase tracking-widest" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                    Endereço de Entrega
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CEP</label>
                                        <input type="text" value={formData.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} placeholder="00000-000" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div />
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Rua</label>
                                        <input type="text" value={formData.street} onChange={(e) => updateField("street", e.target.value)} placeholder="Rua, Avenida..." className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Número</label>
                                        <input type="text" value={formData.number} onChange={(e) => updateField("number", e.target.value)} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Complemento</label>
                                        <input type="text" value={formData.complement} onChange={(e) => updateField("complement", e.target.value)} placeholder="Apto, Bloco..." className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Bairro</label>
                                        <input type="text" value={formData.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cidade</label>
                                        <input type="text" value={formData.city} onChange={(e) => updateField("city", e.target.value)} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Estado</label>
                                        <select value={formData.state} onChange={(e) => updateField("state", e.target.value)} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm">
                                            <option value="">Selecione</option>
                                            {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-4">Opções de Entrega</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-4 bg-white border cursor-pointer border-black">
                                            <input type="radio" name="shipping" defaultChecked className="w-4 h-4 accent-black" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold uppercase tracking-wide">PAC - Correios</p>
                                                <p className="text-xs text-gray-500">5-8 dias úteis</p>
                                            </div>
                                            <span className="text-sm font-bold">{freeShipping ? "Grátis" : formatPrice(shippingCost)}</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-4 bg-white border cursor-pointer border-gray-300 hover:border-black transition-colors">
                                            <input type="radio" name="shipping" className="w-4 h-4 accent-black" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold uppercase tracking-wide">SEDEX - Correios</p>
                                                <p className="text-xs text-gray-500">2-4 dias úteis</p>
                                            </div>
                                            <span className="text-sm font-bold">{formatPrice(29.9)}</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-8">
                                    <button onClick={goBack} className="btn-secondary px-6 py-3 text-sm">
                                        <span className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</span>
                                    </button>
                                    <button onClick={goNext} className="btn-primary px-8 py-3">
                                        <span className="flex items-center gap-2">Continuar <ArrowRight className="w-4 h-4" /></span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === "pagamento" && (
                            <div className="bg-white border border-gray-200 p-6 lg:p-10 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                                <h2 className="text-xl font-black mb-8 uppercase tracking-widest" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                    Pagamento
                                </h2>
                                <div className="space-y-4 mb-8">
                                    <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${formData.paymentMethod === "credit" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                                        <input type="radio" name="payment" value="credit" checked={formData.paymentMethod === "credit"} onChange={(e) => updateField("paymentMethod", e.target.value)} className="w-4 h-4 accent-black" />
                                        <CreditCard className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-wide">Cartão de Crédito</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${formData.paymentMethod === "pix" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                                        <input type="radio" name="payment" value="pix" checked={formData.paymentMethod === "pix"} onChange={(e) => updateField("paymentMethod", e.target.value)} className="w-4 h-4 accent-black" />
                                        <span className="text-lg">📱</span>
                                        <div>
                                            <span className="text-sm font-bold uppercase tracking-wide">PIX</span>
                                            <span className="text-xs bg-black text-white px-2 py-1 ml-2 font-bold uppercase">5% de desconto</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${formData.paymentMethod === "boleto" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                                        <input type="radio" name="payment" value="boleto" checked={formData.paymentMethod === "boleto"} onChange={(e) => updateField("paymentMethod", e.target.value)} className="w-4 h-4 accent-black" />
                                        <span className="text-lg">📄</span>
                                        <span className="text-sm font-bold uppercase tracking-wide">Boleto Bancário</span>
                                    </label>
                                </div>
                                {formData.paymentMethod === "credit" && (
                                    <div className="space-y-5 p-6 border border-gray-200 bg-gray-50">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Número do cartão</label>
                                            <input type="text" value={formData.cardNumber} onChange={(e) => updateField("cardNumber", e.target.value)} placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nome no cartão</label>
                                            <input type="text" value={formData.cardName} onChange={(e) => updateField("cardName", e.target.value)} placeholder="Como está no cartão" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Validade</label>
                                                <input type="text" value={formData.cardExpiry} onChange={(e) => updateField("cardExpiry", e.target.value)} placeholder="MM/AA" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CVV</label>
                                                <input type="text" value={formData.cardCvv} onChange={(e) => updateField("cardCvv", e.target.value)} placeholder="000" maxLength={4} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Parcelas</label>
                                            <select value={formData.installments} onChange={(e) => updateField("installments", e.target.value)} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm font-bold">
                                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n}x de {formatPrice(finalTotal / n)} {n <= 6 ? "sem juros" : ""}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between mt-8">
                                    <button onClick={goBack} className="btn-secondary px-6 py-3 text-sm">
                                        <span className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</span>
                                    </button>
                                    <button onClick={handleFinalize} className="btn-primary px-8 py-4 text-base">
                                        <span className="flex items-center gap-2">
                                            <Lock className="w-4 h-4" /> Finalizar Pedido — {formatPrice(finalTotal)}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white border border-gray-200 p-6 sticky top-24">
                            <h3 className="font-black text-sm uppercase tracking-widest mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                Resumo do Pedido ({items.length})
                            </h3>
                            <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex-shrink-0 relative">
                                            <img src={item.product.images[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100"} alt="" className="w-full h-full object-cover" />
                                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate uppercase tracking-wide">{item.product.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{item.selectedSize} / {item.selectedColor}</p>
                                        </div>
                                        <span className="text-xs font-black">{formatPrice(item.product.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500"><span>Subtotal</span><span className="text-black">{formatPrice(total)}</span></div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500"><span>Frete</span><span className={freeShipping ? "text-primary" : "text-black"}>{freeShipping ? "Grátis" : formatPrice(shippingCost)}</span></div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between font-black text-lg">
                                    <span className="uppercase">Total</span><span>{formatPrice(finalTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}