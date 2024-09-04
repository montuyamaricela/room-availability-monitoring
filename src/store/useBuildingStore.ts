import { create } from "zustand";
import { type BuildingName } from "~/components/rooms/getBuildingComponent";

interface BuildingState {
  selectedBuilding: BuildingName;
  setSelectedBuilding: (selectedBuilding: BuildingName) => void;
}

export const useBuildingStore = create<BuildingState>((set) => ({
  selectedBuilding: "BSBA", // Initial step
  setSelectedBuilding: (newSelectedBuilding) =>
    set({ selectedBuilding: newSelectedBuilding }),
}));
