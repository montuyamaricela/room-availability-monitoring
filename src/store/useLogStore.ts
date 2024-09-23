/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { create } from "zustand";
import { type auditLogsAttributes } from "~/data/models/auditLogs";
import { initialPaginatedList, type PaginatedList } from "~/lib/types";

interface logState {
  auditLog: PaginatedList<auditLogsAttributes>;
  setAuditLogs: (auditLog: PaginatedList<auditLogsAttributes>) => void;
}

export const useLogStore = create<logState>((set) => ({
  auditLog: initialPaginatedList,
  setAuditLogs: (auditLog) => set({ auditLog }), // Correctly setting the selected room
}));
