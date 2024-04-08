import { create } from "zustand";

export const useDialog = create((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  data: {},
  setData: (data) => set({ data: { data } }),
}));
