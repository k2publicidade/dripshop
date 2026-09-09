import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  replaceItems: (items: CartItem[]) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

function mirrorItem(item: CartItem | undefined) {
  if (!item) return;
  void fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: item.product.id, quantity: item.quantity, selectedSize: item.selectedSize, selectedColor: item.selectedColor }) }).catch(() => {});
}

export const useCartStore = create<CartStore>()(persist((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product: Product, size: string, color: string) => {
    if (!product.sizes.includes(size) || !product.colors.some(c => c.name === color) || !product.stock) return;
    const variantStock = product.variants?.find(v => v.size === size && v.color === color)?.stock || 0;
    const variantQuantity = get().items.find(i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color)?.quantity || 0;
    if (variantQuantity >= variantStock) return;
    const productQuantity = get().items.filter(i => i.product.id === product.id).reduce((n,i) => n+i.quantity,0);
    if (productQuantity >= product.stock) return;
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
    queueMicrotask(() => mirrorItem(get().items.find(i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color)));
  },

  removeItem: (productId: string, size: string, color: string) => {
    set((state) => ({
      items: state.items.filter(
        item => !(item.product.id === productId && 
                 item.selectedSize === size && 
                 item.selectedColor === color)
      )
    }));
    void fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, selectedSize: size, selectedColor: color }) }).catch(() => {});
  },

  updateQuantity: (productId: string, size: string, color: string, quantity: number) => {
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity: Math.min(item.product.variants?.find(v => v.size === size && v.color === color)?.stock || 0, 99, Math.max(0, Math.floor(quantity))) }
          : item
      ).filter(item => item.quantity > 0)
    }));
    queueMicrotask(() => mirrorItem(get().items.find(i => i.product.id === productId && i.selectedSize === size && i.selectedColor === color)));
  },

  clearCart: () => { set({ items: [] }); void fetch('/api/cart', { method: 'DELETE' }).catch(() => {}); },
  replaceItems: (items) => set({ items }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}), { name: 'dripshop-cart-v2', partialize: (state) => ({ items: state.items }) }));
