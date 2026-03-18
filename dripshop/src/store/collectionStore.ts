"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
  createdAt: string;
}

interface CollectionStore {
  collections: Collection[];
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>) => void;
  updateCollection: (id: string, collection: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  toggleActive: (id: string) => void;
  toggleFeatured: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const initialCollections: Collection[] = [
  { id: "1", name: "Self-Data", slug: "self-data", description: "Coleção exclusiva com design autoral", image: "", isActive: true, isFeatured: true, productCount: 15, createdAt: "2025-01-10" },
  { id: "2", name: "Dark Mood", slug: "dark-mood", description: "Estilo sombrio e elegante", image: "", isActive: true, isFeatured: true, productCount: 12, createdAt: "2025-01-12" },
  { id: "3", name: "Astrocore", slug: "astrocore", description: "Explorando o cosmos", image: "", isActive: true, isFeatured: false, productCount: 18, createdAt: "2025-01-15" },
  { id: "4", name: "Street", slug: "street", description: "Coleção streetwear urbana", image: "", isActive: true, isFeatured: false, productCount: 22, createdAt: "2025-01-18" },
  { id: "5", name: "Directors Cut", slug: "directors-cut", description: "Edição especial", image: "", isActive: true, isFeatured: false, productCount: 10, createdAt: "2025-01-20" },
  { id: "6", name: "Ruínas", slug: "ruinas", description: "Coleção inspirada em ruínas", image: "", isActive: false, isFeatured: false, productCount: 8, createdAt: "2025-01-22" },
  { id: "7", name: "Metaru", slug: "metaru", description: "Fusão de elementos", image: "", isActive: true, isFeatured: false, productCount: 14, createdAt: "2025-01-25" },
  { id: "8", name: "Gods of Olympus", slug: "gods-of-olympus", description: "Mitologia grega", image: "", isActive: true, isFeatured: true, productCount: 9, createdAt: "2025-02-01" },
];

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set) => ({
      collections: initialCollections,
      addCollection: (collection) =>
        set((state) => ({
          collections: [
            {
              ...collection,
              id: generateId(),
              productCount: 0,
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.collections,
          ],
        })),
      updateCollection: (id, collection) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...collection } : c
          ),
        })),
      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),
      toggleActive: (id) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),
      toggleFeatured: (id) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, isFeatured: !c.isFeatured } : c
          ),
        })),
    }),
    {
      name: 'dripshop-collections',
    }
  )
);
