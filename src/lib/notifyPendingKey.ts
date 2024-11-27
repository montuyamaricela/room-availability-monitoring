"use server"
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { addMinutes, isPast, parse } from "date-fns";
import { db } from "~/server/db";
// import { sendPendingKeyReturn } from "~/utils/email";
import { formatTimetoLocal } from "./timeSchedule";

export const checkAndNotifyPendingKeyReturns = async () => {
    try {
      const roomSchedules = await db.roomSchedule.findMany({
        include: {
          roomScheduleRecords: true,
          faculty: true,
          room: true,
        },
      });
  
      for (const schedule of roomSchedules) {
        const { roomScheduleRecords, faculty, room, endTime } = schedule;
        const formattedEndTime = parse(
          formatTimetoLocal(endTime),
          "h:mm a",
          new Date(),
        );

        const fifteenMinutesAfterEnd = addMinutes(formattedEndTime, 15);
        for (const record of roomScheduleRecords) {
          if (record.notificationSent) continue;
          if (!record.timeOut && isPast(fifteenMinutesAfterEnd)) {
            await fetch(`${process.env.NEXTAUTH_URL}/api/pending-notif`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: faculty.email,
                facultyName: faculty.facultyName,
                roomName: room.roomName,
                recordId: record.id
              }),
            });
         
          }
        }
      }
    } catch (error) {
      console.error("Error checking pending key returns:", error);
      throw new Error("Error checking pending key returns");
    }
  };
  
