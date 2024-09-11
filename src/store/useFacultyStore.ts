import { create } from "zustand";

interface Faculty {
  id: number;
  facultyName: string;
}

interface FacultyState {
  faculty: Faculty[];
  setFaculty: (faculty: Faculty[]) => void;
}

export const useFacultyStore = create<FacultyState>((set) => ({
  faculty: [],
  setFaculty: (faculty) => set({ faculty }),
}));
