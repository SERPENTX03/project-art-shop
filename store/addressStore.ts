import { create } from "zustand";
import { Address } from "@/types/adress";

interface AddressState {
  address: Address | null;
  loading: boolean;
  setAddress: (address: Address) => void;
  setLoading: (loading: boolean) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  address: null,
  loading: true,
  setAddress: (address) => set({ address }),
  setLoading: (loading) => set({ loading }),
}));
