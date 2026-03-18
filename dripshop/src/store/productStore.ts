"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  collection?: string;
  creator?: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isActive: boolean;
  stock: number;
  createdAt: string;
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleActive: (id: string) => void;
  toggleFeatured: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Camiseta Oversized Self-Data",
    slug: "camiseta-oversized-self-data",
    price: 119.9,
    originalPrice: 149.9,
    description: "O cropped oversized da DripShop tem corte largo, comprimento encurtado e caimento estruturado.",
    images: ["/mockup.jpg"],
    category: "camisetas",
    collection: "self-data",
    colors: [{ name: "Preto", hex: "#000000" }, { name: "Branco", hex: "#ffffff" }],
    sizes: ["P", "M", "G", "GG"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    stock: 45,
    createdAt: "2025-03-01"
  },
  {
    id: "2",
    name: "Moletom Dark Mood com Capuz",
    slug: "moletom-dark-mood",
    price: 199.9,
    description: "Moletom premium com capuz e estampa exclusiva.",
    images: ["/mockup.jpg"],
    category: "moletom",
    collection: "dark-mood",
    colors: [{ name: "Preto", hex: "#000000" }],
    sizes: ["P", "M", "G", "GG", "XG"],
    isNew: false,
    isFeatured: true,
    isActive: true,
    stock: 23,
    createdAt: "2025-03-02"
  },
  {
    id: "3",
    name: "Camiseta Street Collection",
    slug: "camiseta-street-collection",
    price: 89.9,
    description: "Camiseta street com estampa exclusiva.",
    images: ["/mockup.jpg"],
    category: "camisetas",
    colors: [{ name: "Branco", hex: "#ffffff" }, { name: "Cinza", hex: "#6b7280" }],
    sizes: ["P", "M", "G", "GG"],
    isActive: true,
    stock: 67,
    createdAt: "2025-03-05"
  },
  {
    id: "4",
    name: "Caneca Metaru",
    slug: "caneca-metaru",
    price: 39.9,
    description: "Caneca premium exclusiva.",
    images: ["/mockup.jpg"],
    category: "acessorios",
    colors: [{ name: "Preto", hex: "#000000" }],
    sizes: ["Único"],
    isActive: true,
    stock: 120,
    createdAt: "2025-03-08"
  },
  {
    id: "5",
    name: "Moletom Astrocore Premium",
    slug: "moletom-astrocore",
    price: 199.9,
    originalPrice: 249.9,
    description: "Moletom premium da coleção Astrocore.",
    images: ["/mockup.jpg"],
    category: "moletom",
    collection: "astrocore",
    colors: [{ name: "Preto", hex: "#000000" }, { name: "Azul", hex: "#1e40af" }],
    sizes: ["P", "M", "G", "GG"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    stock: 12,
    createdAt: "2025-03-10"
  },
  {
    id: "6",
    name: "Camiseta Oversized Ruínas",
    slug: "camiseta-ruinas",
    price: 99.9,
    description: "Camiseta da coleção Ruínas.",
    images: ["/mockup.jpg"],
    category: "camisetas",
    collection: "ruinas",
    colors: [{ name: "Preto", hex: "#000000" }],
    sizes: ["P", "M", "G", "GG"],
    isActive: false,
    stock: 0,
    createdAt: "2025-03-12"
  },
];

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: initialProducts,
      addProduct: (product) =>
        set((state) => ({
          products: [
            {
              ...product,
              id: generateId(),
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.products,
          ],
        })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      toggleActive: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          ),
        })),
      toggleFeatured: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
          ),
        })),
    }),
    {
      name: 'dripshop-products',
    }
  )
);
