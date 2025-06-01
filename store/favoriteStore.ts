import { create } from "zustand";

interface FavoriteStore {
  count: number;
  setCount: (count: number) => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
}));
