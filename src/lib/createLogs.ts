import { api } from "~/trpc/react";

interface logOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useActivityLog = ({ onSuccess, onError }: logOptions = {}) => {
  // Wrap the mutation inside a custom hook
  const createActivityLog = api.logs.activityLogs.useMutation({
    onSuccess: (data) => {
      // Call the provided onSuccess callback if available
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error creating user activity logs:", error);
      // Call the provided onError callback if available
      if (onError) {
        onError(error);
      }
    },
  });

  // Return a function to trigger the mutation
  const logActivity = (userID: string, activity: string) => {
    createActivityLog.mutate({ userID, activity });
  };

  return { logActivity };
};

export const useRoomLog = ({ onSuccess, onError }: logOptions = {}) => {
  // Wrap the mutation inside a custom hook
  const createRoomLogs = api.logs.roomLogs.useMutation({
    onSuccess: (data) => {
      // Call the provided onSuccess callback if available
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error creating user activity logs:", error);
      // Call the provided onError callback if available
      if (onError) {
        onError(error);
      }
    },
  });

  // Return a function to trigger the mutation
  const logActivity = (
    loggedBy: string,
    activity: string,
    careOf: string,
    facultyName: string,
    roomId: string,
  ) => {
    createRoomLogs.mutate({ loggedBy, activity, careOf, facultyName, roomId });
  };

  return { logActivity };
};
