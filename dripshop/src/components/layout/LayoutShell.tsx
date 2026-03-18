"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const AUTH_ROUTES = ["/login", "/cadastro", "/recuperar-senha"];
const ADMIN_ROUTES = ["/admin"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const isAdminPage = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
    const showShopShell = !isAuthPage && !isAdminPage;

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
