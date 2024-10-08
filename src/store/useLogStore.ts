/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { create } from "zustand";
import {
  type roomLogsAttributes,
  type activityLogsAttributes,
} from "~/data/models/auditLogs";
import { initialPaginatedList, type PaginatedList } from "~/lib/types";

interface logState {
  activityLog: PaginatedList<activityLogsAttributes>;
  setActivityLogs: (auditLog: PaginatedList<activityLogsAttributes>) => void;
  roomLog: PaginatedList<roomLogsAttributes>;
  setRoomLog: (auditLog: PaginatedList<roomLogsAttributes>) => void;
}

export const useLogStore = create<logState>((set) => ({
  activityLog: initialPaginatedList,
  setActivityLogs: (activityLog) => set({ activityLog }),
  roomLog: initialPaginatedList,
  setRoomLog: (roomLog) => set({ roomLog }),
}));
