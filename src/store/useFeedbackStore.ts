import { create } from "zustand";
import { type feedBackAttributes } from "~/data/models/feedback";
import { initialPaginatedList, type PaginatedList } from "~/lib/types";

interface feedbackState {
  feedbacks: PaginatedList<feedBackAttributes>;
  setFeedbacks: (feedbacks: PaginatedList<feedBackAttributes>) => void;
  departmentFeedbacks: PaginatedList<feedBackAttributes>;
  setDepartmentFeedbacks: (
    feedbacks: PaginatedList<feedBackAttributes>,
  ) => void;
}

export const useFeedbackStore = create<feedbackState>((set) => ({
  feedbacks: initialPaginatedList,
  setFeedbacks: (feedbacks) => set({ feedbacks }),
  departmentFeedbacks: initialPaginatedList,
  setDepartmentFeedbacks: (departmentFeedbacks) => set({ departmentFeedbacks }),
}));
