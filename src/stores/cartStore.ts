import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';
import { Product } from '@services/productApi';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shipFee: number | null;
  distanceKm: number | null;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  changeQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  setShippingInfo: (fee: number, distance: number) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shipFee: null,
      distanceKm: null,

      addItem: (product: Product) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + 1,
            };
            return { items: newItems };
          } else {
            return {
              items: [...state.items, { product, quantity: 1 }],
            };
          }
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      changeQuantity: (productId: number, delta: number) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: newItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setShippingInfo: (fee: number, distance: number) => {
        set({ shipFee: fee, distanceKm: distance });
      },

      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce((sum, item) => {
          const itemPrice = Math.round(item.product.price * PRICE_MULTIPLIER);
          return sum + itemPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        shipFee: state.shipFee,
        distanceKm: state.distanceKm,
      }),
    }
  )
);

export default useCartStore;
