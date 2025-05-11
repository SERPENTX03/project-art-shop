import { create } from "zustand";

type CartStore = {
  count: number;
  setCount: (count: number) => void;
  increment: (amount?: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  increment: (amount = 1) => set((state) => ({ count: state.count + amount })),
}));
