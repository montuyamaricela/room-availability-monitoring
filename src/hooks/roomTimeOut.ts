/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import toast from "react-hot-toast";
import { type scheduleAttributes } from "~/data/models/schedule";
import { useRoomLog } from "~/lib/createLogs";

export default async function roomTimeOut(
  selectedSchedule: scheduleAttributes | null,
  setSubmitted: (submitted: boolean) => void,
  setDeleted: (deleted: boolean) => void,
) {
  try {
    const response = await fetch("/api/room-schedule", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        roomId: selectedSchedule ? selectedSchedule.roomId : "",
        action: "Returned the key",
        id: selectedSchedule ? selectedSchedule.id : null,
        careOf: selectedSchedule ? selectedSchedule.faculty.facultyName : "",
        ...selectedSchedule,
      }),
    });
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Timed out sucessfully!");
    } else {
      toast.error(responseData?.message || "Something went wrong");
      console.error("Something went wrong");
    }
    setTimeout(() => {
      setSubmitted(true);
      setDeleted(true);
    }, 1500);
  } catch (error) {
    console.error("Error updating room status", error);
  }
}
