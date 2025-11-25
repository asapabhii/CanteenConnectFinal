import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of a menu item and a cart item
type MenuItem = {
  id: string;
  name: string;
  price: number;
  outletId: string;
  imageUrl?: string | null; // <-- Add imageUrl
};

type CartItem = {
  item: MenuItem;
  quantity: number;
};

// Define the state and actions for our store
type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem) => void;
  decreaseItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  removeAllItems: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      removeAllItems: () => set({ items: [] }),

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (cartItem) => cartItem.item.id === newItem.id,
        );

        const updatedItems = [...currentItems];

        if (existingItemIndex > -1) {
          const updatedItem = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          };
          updatedItems[existingItemIndex] = updatedItem;
        } else {
          updatedItems.push({ item: newItem, quantity: 1 });
        }
        
        set({ items: updatedItems });
      },

      // NEW FUNCTION
      decreaseItem: (itemId) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(cartItem => cartItem.item.id === itemId);

        if (existingItem && existingItem.quantity > 1) {
          // If quantity is more than 1, decrease it
          set({
            items: currentItems.map(cartItem => 
              cartItem.item.id === itemId 
              ? { ...cartItem, quantity: cartItem.quantity - 1 } 
              : cartItem
            )
          });
        } else {
          // If quantity is 1, remove the item completely
          get().removeItem(itemId);
        }
      },

      removeItem: (itemId) => {
        set({
          items: get().items.filter((cartItem) => cartItem.item.id !== itemId),
        });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
          0,
        );
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);