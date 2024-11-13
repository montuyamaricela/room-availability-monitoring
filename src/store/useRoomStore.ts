import { create } from "zustand";

export interface Room {
  id: string;
  roomName: string;
  building: string;
  floor: string;
  withTv: boolean;
  isLecture: boolean;
  isLaboratory: boolean;
  isAirconed: boolean;
  laboratoryType: string;
  capacity: number;
  electricFans: number;
  functioningComputers: number;
  notFunctioningComputers: number;
  status: string;
  disable: boolean;
}

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null; // Initial state can be null if no room is selected
  setSelectedRoom: (selectedRoom: Room) => void;
  setRooms: (rooms: Room[]) => void;
  clearRooms: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  selectedRoom: null,
  setSelectedRoom: (selectedRoom) => set({ selectedRoom }), // Correctly setting the selected room
  setRooms: (rooms) => set({ rooms }),
  clearRooms: () => set({ rooms: [] }),
}));
