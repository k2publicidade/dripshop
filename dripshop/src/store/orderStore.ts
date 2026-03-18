"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  trackingCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStore {
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateTrackingCode: (id: string, code: string) => void;
  addOrderNote: (id: string, note: string) => void;
  cancelOrder: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
const generateOrderNumber = () => `DRP-${Date.now().toString(36).toUpperCase()}`;

const initialOrders: Order[] = [
  {
    id: "1",
    orderNumber: "DRP-001",
    customer: { name: "João Silva", email: "joao@email.com", phone: "(11) 99999-9999" },
    shippingAddress: { street: "Rua Example, 123", city: "São Paulo", state: "SP", zipCode: "01234-567" },
    items: [
      { id: "1", name: "Camiseta Oversized Self-Data", price: 119.9, quantity: 1, size: "G", color: "Preto", image: "/mockup.jpg" },
      { id: "2", name: "Caneca Metaru", price: 39.9, quantity: 2, size: "Único", color: "Preto", image: "/mockup.jpg" },
    ],
    subtotal: 199.7,
    shipping: 15.0,
    total: 214.7,
    status: "PROCESSING",
    paymentMethod: "PIX",
    paymentStatus: "PAID",
    createdAt: "2025-03-17T10:30:00Z",
    updatedAt: "2025-03-17T14:20:00Z",
  },
  {
    id: "2",
    orderNumber: "DRP-002",
    customer: { name: "Maria Santos", email: "maria@email.com", phone: "(11) 88888-8888" },
    shippingAddress: { street: "Av. Example, 456", city: "Rio de Janeiro", state: "RJ", zipCode: "20000-000" },
    items: [
      { id: "3", name: "Moletom Dark Mood", price: 199.9, quantity: 1, size: "M", color: "Preto", image: "/mockup.jpg" },
    ],
    subtotal: 199.9,
    shipping: 0,
    total: 199.9,
    status: "SHIPPED",
    paymentMethod: "Cartão",
    paymentStatus: "PAID",
    trackingCode: "BR123456789",
    createdAt: "2025-03-16T15:45:00Z",
    updatedAt: "2025-03-17T09:00:00Z",
  },
  {
    id: "3",
    orderNumber: "DRP-003",
    customer: { name: "Pedro Costa", email: "pedro@email.com", phone: "(11) 77777-7777" },
    shippingAddress: { street: "Rua Test, 789", city: "São Paulo", state: "SP", zipCode: "05000-000" },
    items: [
      { id: "4", name: "Camiseta Street Collection", price: 89.9, quantity: 2, size: "P", color: "Branco", image: "/mockup.jpg" },
      { id: "5", name: "Moletom Astrocore", price: 199.9, quantity: 1, size: "GG", color: "Azul", image: "/mockup.jpg" },
    ],
    subtotal: 379.7,
    shipping: 15.0,
    total: 394.7,
    status: "CONFIRMED",
    paymentMethod: "PIX",
    paymentStatus: "PAID",
    createdAt: "2025-03-16T11:20:00Z",
    updatedAt: "2025-03-16T12:00:00Z",
  },
  {
    id: "4",
    orderNumber: "DRP-004",
    customer: { name: "Ana Oliveira", email: "ana@email.com", phone: "(11) 66666-6666" },
    shippingAddress: { street: "Av. Live, 321", city: "Belo Horizonte", state: "MG", zipCode: "30000-000" },
    items: [
      { id: "6", name: "Camiseta Oversized Self-Data", price: 119.9, quantity: 1, size: "G", color: "Branco", image: "/mockup.jpg" },
    ],
    subtotal: 119.9,
    shipping: 15.0,
    total: 134.9,
    status: "DELIVERED",
    paymentMethod: "Boleto",
    paymentStatus: "PAID",
    trackingCode: "BR987654321",
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2025-03-16T16:00:00Z",
  },
  {
    id: "5",
    orderNumber: "DRP-005",
    customer: { name: "Lucas Lima", email: "lucas@email.com", phone: "(11) 55555-5555" },
    shippingAddress: { street: "Rua Mock, 654", city: "São Paulo", state: "SP", zipCode: "04000-000" },
    items: [
      { id: "7", name: "Moletom Dark Mood", price: 199.9, quantity: 2, size: "G", color: "Preto", image: "/mockup.jpg" },
      { id: "8", name: "Caneca Metaru", price: 39.9, quantity: 3, size: "Único", color: "Preto", image: "/mockup.jpg" },
    ],
    subtotal: 509.5,
    shipping: 0,
    total: 509.5,
    status: "PENDING",
    paymentMethod: "Cartão",
    paymentStatus: "PENDING",
    createdAt: "2025-03-17T16:00:00Z",
    updatedAt: "2025-03-17T16:00:00Z",
  },
  {
    id: "6",
    orderNumber: "DRP-006",
    customer: { name: "Julia Mendes", email: "julia@email.com", phone: "(11) 44444-4444" },
    shippingAddress: { street: "Av. Sample, 111", city: "São Paulo", state: "SP", zipCode: "01000-000" },
    items: [
      { id: "9", name: "Camiseta Oversized Self-Data", price: 119.9, quantity: 1, size: "P", color: "Preto", image: "/mockup.jpg" },
    ],
    subtotal: 119.9,
    shipping: 15.0,
    total: 134.9,
    status: "CANCELLED",
    paymentMethod: "PIX",
    paymentStatus: "REFUNDED",
    notes: "Cliente solicitou cancelamento",
    createdAt: "2025-03-14T10:00:00Z",
    updatedAt: "2025-03-15T11:00:00Z",
  },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: initialOrders,
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        })),
      updateTrackingCode: (id, code) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, trackingCode: code, updatedAt: new Date().toISOString() } : o
          ),
        })),
      addOrderNote: (id, note) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, notes: note, updatedAt: new Date().toISOString() } : o
          ),
        })),
      cancelOrder: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'CANCELLED', paymentStatus: 'REFUNDED', updatedAt: new Date().toISOString() } : o
          ),
        })),
    }),
    {
      name: 'dripshop-orders',
    }
  )
);
