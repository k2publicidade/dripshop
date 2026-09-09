import { create } from 'zustand';

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    cpf?: string;
    role: 'CUSTOMER' | 'ADMIN';
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    confirmationRequired: boolean;
    refresh: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: { email: string; password: string; name?: string }) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    confirmationRequired: false,
    refresh: async () => {
        try {
            const response = await fetch('/api/auth/session');
            const { user } = await response.json();
            set({ user, isAuthenticated: !!user });
        } catch { set({ user: null, isAuthenticated: false }); }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok && data.user) {
                set({ user: data.user, isAuthenticated: true, isLoading: false });
                return true;
            }
            set({ isLoading: false });
            return false;
        } catch {
            set({ isLoading: false });
            return false;
        }
    },

    register: async (data) => {
        set({ isLoading: true });
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (res.ok && result.confirmationRequired) {
                set({ confirmationRequired: true, isLoading: false });
                return true;
            }
            if (res.ok && result.user) {
                set({ user: result.user, isAuthenticated: true, isLoading: false });
                return true;
            }
            set({ isLoading: false });
            return false;
        } catch {
            set({ isLoading: false });
            return false;
        }
    },

    logout: async () => {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        set({ user: null, isAuthenticated: false });
        void response;
    },

    setUser: (user) => {
        set({ user, isAuthenticated: !!user });
    },
}));
