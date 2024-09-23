/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type deleteScheduleProps = {
  setLoading: (loading: boolean) => void;
  setMessage: (message: string) => void;
};

export async function deleteSchedule({
  setLoading,
  setMessage,
}: deleteScheduleProps) {
  try {
    setLoading(true);
    const response = await fetch("/api/schedule", {
      method: "POST",
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error("Unable to delete schedule, please try again");
    }

    setMessage(responseData?.message);
    setLoading(false);
  } catch (error) {
    console.error("Error deleting schedules", error);
  }
}
