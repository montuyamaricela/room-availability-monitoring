import { create } from "zustand";

interface FilterStore {
  filters: string[];
  toggleFilter: (id: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: [],
  toggleFilter: (id: string) =>
    set((state) => ({
      filters: state.filters.includes(id)
        ? state.filters.filter((filter) => filter !== id)
        : [...state.filters, id],
    })),
}));
