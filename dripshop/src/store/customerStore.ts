"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  isActive: boolean;
  createdAt: string;
}

interface CustomerStore {
  customers: Customer[];
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  toggleActive: (id: string) => void;
}

const initialCustomers: Customer[] = [
  { id: "1", name: "João Silva", email: "joao@email.com", phone: "(11) 99999-9999", cpf: "123.456.789-00", totalOrders: 5, totalSpent: 1249.50, lastOrderDate: "2025-03-17", isActive: true, createdAt: "2024-06-15" },
  { id: "2", name: "Maria Santos", email: "maria@email.com", phone: "(11) 88888-8888", cpf: "987.654.321-00", totalOrders: 3, totalSpent: 599.70, lastOrderDate: "2025-03-16", isActive: true, createdAt: "2024-08-20" },
  { id: "3", name: "Pedro Costa", email: "pedro@email.com", phone: "(11) 77777-7777", cpf: "456.789.123-00", totalOrders: 8, totalSpent: 2156.00, lastOrderDate: "2025-03-15", isActive: true, createdAt: "2024-03-10" },
  { id: "4", name: "Ana Oliveira", email: "ana@email.com", phone: "(11) 66666-6666", cpf: "321.654.987-00", totalOrders: 2, totalSpent: 299.80, lastOrderDate: "2025-03-14", isActive: true, createdAt: "2024-11-05" },
  { id: "5", name: "Lucas Lima", email: "lucas@email.com", phone: "(11) 55555-5555", cpf: "654.321.456-00", totalOrders: 12, totalSpent: 3456.00, lastOrderDate: "2025-03-12", isActive: true, createdAt: "2024-01-20" },
  { id: "6", name: "Julia Mendes", email: "julia@email.com", phone: "(11) 44444-4444", cpf: "789.123.654-00", totalOrders: 1, totalSpent: 119.90, isActive: false, createdAt: "2025-02-28" },
];

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      customers: initialCustomers,
      updateCustomer: (id, customer) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...customer } : c
          ),
        })),
      toggleActive: (id) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),
    }),
    {
      name: 'dripshop-customers',
    }
  )
);
