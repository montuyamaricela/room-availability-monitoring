import toast from "react-hot-toast";
import { api } from "~/trpc/react";

interface logOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useFeedbackAutomation = ({
  onSuccess,
  onError,
}: logOptions = {}) => {
  // Wrap the mutation inside a custom hook
  const createFeedback = api.feedback.createFeedback.useMutation({
    onSuccess: () => {
      console.log("Feedback created!");
    },
    onError: (error) => {
      console.error("Error fetching user status:", error);
    },
  });

  // Return a function to trigger the mutation
  const automateFeedback = (department: string, feedback: string) => {
    createFeedback.mutate({
      department: department,
      feedback: feedback,
    });
  };

  return { automateFeedback };
};
