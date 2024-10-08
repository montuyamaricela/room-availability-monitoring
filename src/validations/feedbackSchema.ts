import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const feedbackSchema = z.object({
  department: z.string().min(1, "Department is required"),
  feedback: z.string().min(1, "Feedback is required"),
});

export type IFeedback = z.infer<typeof feedbackSchema>;
export const FeedbackResolver = zodResolver(feedbackSchema);

export const FeedbackDefaultValues = {
  department: "",
  feedback: "",
};
