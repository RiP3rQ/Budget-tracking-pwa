import { create } from "zustand";

type SingleTransactionSheetState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useEditTransactionSheet = create<SingleTransactionSheetState>(
  (set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: number) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
  }),
);
