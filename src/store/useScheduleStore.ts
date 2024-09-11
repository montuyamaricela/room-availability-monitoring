/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { create } from "zustand";
import { type scheduleAttributes } from "~/data/models/schedule";
import { initialPaginatedList, type PaginatedList } from "~/lib/types";

interface scheduleState {
  schedule: PaginatedList<scheduleAttributes>;
  setSchedule: (schedule: PaginatedList<scheduleAttributes>) => void;
}

export const useScheduleStore = create<scheduleState>((set) => ({
  schedule: initialPaginatedList,
  setSchedule: (schedule) => set({ schedule }), // Correctly setting the selected room
}));
