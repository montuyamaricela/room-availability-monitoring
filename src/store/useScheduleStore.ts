/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { create } from "zustand";
import {
  type scheduleRecordsAttributes,
  type scheduleAttributes,
} from "~/data/models/schedule";
import { initialPaginatedList, type PaginatedList } from "~/lib/types";

interface scheduleState {
  schedule: PaginatedList<scheduleAttributes>;
  scheduleRecord: PaginatedList<scheduleRecordsAttributes>;
  setSchedule: (schedule: PaginatedList<scheduleAttributes>) => void;
  setScheduleRecord: (
    scheduleRecord: PaginatedList<scheduleRecordsAttributes>,
  ) => void;
  clearSchedule: () => void; // New clearSchedule method
}

export const useScheduleStore = create<scheduleState>((set) => ({
  schedule: initialPaginatedList,
  scheduleRecord: initialPaginatedList,
  setSchedule: (schedule) => set({ schedule }),
  setScheduleRecord: (scheduleRecord) => set({ scheduleRecord }),
  clearSchedule: () => set({ schedule: initialPaginatedList }),
}));
