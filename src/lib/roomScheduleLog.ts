import { api } from "~/trpc/react";

interface logOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useTimeOut = ({ onSuccess, onError }: logOptions = {}) => {
  // Wrap the mutation inside a custom hook
  const TimeOut = api.schedule.TimeOut.useMutation({
    onSuccess: () => {
      // Call the provided onSuccess callback if available
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("An error occured: ", error);
      // Call the provided onError callback if available
      if (onError) {
        onError(error);
      }
    },
  });

  // Return a function to trigger the mutation
  const timeOutRoom = (scheduleRecordId: number) => {
    TimeOut.mutate({ scheduleRecordId });
  };

  return { timeOutRoom };
};

export const useTimeIn = ({ onSuccess, onError }: logOptions = {}) => {
  // Wrap the mutation inside a custom hook
  const TimeIn = api.schedule.TimeIn.useMutation({
    onSuccess: () => {
      // Call the provided onSuccess callback if available
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("An error occured: ", error);
      // Call the provided onError callback if available
      if (onError) {
        onError(error);
      }
    },
  });

  // Return a function to trigger the mutation
  const timeInRoom = (roomScheduleId: number, facultyName: string) => {
    TimeIn.mutate({ roomScheduleId, facultyName });
  };

  return { timeInRoom };
};
