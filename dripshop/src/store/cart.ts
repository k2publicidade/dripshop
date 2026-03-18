import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product: Product, size: string, color: string) => {
    set((state) => {
      const existingItem = state.items.find(
        item => item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
      );

      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id && 
            item.selectedSize === size && 
            item.selectedColor === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        items: [...state.items, { product, quantity: 1, selectedSize: size, selectedColor: color }]
      };
    });
  },

  removeItem: (productId: string, size: string, color: string) => {
    set((state) => ({
      items: state.items.filter(
        item => !(item.product.id === productId && 
                 item.selectedSize === size && 
                 item.selectedColor === color)
      )
    }));
  },

  updateQuantity: (productId: string, size: string, color: string, quantity: number) => {
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    }));
  },

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}));
