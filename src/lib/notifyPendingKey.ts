"use server";
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { addMinutes, isPast, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { db } from "~/server/db";
import { sendPendingKeyReturn } from "~/utils/email";
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
            await sendPendingKeyReturn(
              faculty.email, 
              faculty.facultyName,
              room.roomName 
            );
  
            await db.roomScheduleRecord.update({
              where: { id: record.id },
              data: { notificationSent: true },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking pending key returns:", error);
      throw new Error("Error checking pending key returns");
    }
  };
  
