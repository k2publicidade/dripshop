"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';

const AUTH_ROUTES = ["/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"];
const ADMIN_ROUTES = ["/admin"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    useEffect(() => {
        let active = true;
        void (async () => {
            await useAuthStore.getState().refresh();
            const user = useAuthStore.getState().user;
            if (!user) return;
            const [cartResponse, productsResponse] = await Promise.all([fetch('/api/cart'), fetch('/api/products')]);
            if (!active || !cartResponse.ok || !productsResponse.ok) return;
            const cart = (await cartResponse.json()).data as { product_id: string; quantity: number; selected_size: string; selected_color: string }[];
            const products = (await productsResponse.json()).data.products as Product[];
            const items = cart.flatMap(row => { const product = products.find(item => item.id === row.product_id); const stock = product?.variants?.find(item => item.size === row.selected_size && item.color === row.selected_color)?.stock || 0; return product && stock > 0 ? [{ product, quantity: Math.min(row.quantity, stock, 99), selectedSize: row.selected_size, selectedColor: row.selected_color }] : []; });
            if (active && items.length) useCartStore.getState().replaceItems(items);
        })();
        return () => { active = false; };
    }, []);

    const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const isAdminPage = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

    if (isAuthPage) {
        return <>{children}</>;
    }

    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="pt-[80px] lg:pt-[112px] min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
        </>
    );
}
