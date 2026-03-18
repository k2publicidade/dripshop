"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'productCount'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleActive: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const initialCategories: Category[] = [
  { id: "1", name: "Camisetas", slug: "camisetas", description: "Camisetas oversized e tradicionais", image: "", isActive: true, productCount: 45, createdAt: "2025-01-01" },
  { id: "2", name: "Moletom", slug: "moletom", description: "Moletons com e sem capuz", image: "", isActive: true, productCount: 23, createdAt: "2025-01-01" },
  { id: "3", name: "Manga Longa", slug: "manga-longa", description: "Camisetas de manga longa", image: "", isActive: true, productCount: 12, createdAt: "2025-01-01" },
  { id: "4", name: "Acessórios", slug: "acessorios", description: "Bonés, mochilas e mais", image: "", isActive: true, productCount: 18, createdAt: "2025-01-01" },
  { id: "5", name: "Calças", slug: "calcas", description: "Calças jeans e casual", image: "", isActive: false, productCount: 8, createdAt: "2025-01-01" },
  { id: "6", name: "Jaquetas", slug: "jaquetas", description: "Jaquetas e casacos", image: "", isActive: true, productCount: 15, createdAt: "2025-01-01" },
];

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: initialCategories,
      addCategory: (category) =>
        set((state) => ({
          categories: [
            {
              ...category,
              id: generateId(),
              productCount: 0,
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.categories,
          ],
        })),
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      toggleActive: (id) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),
    }),
    {
      name: 'dripshop-categories',
    }
  )
);
