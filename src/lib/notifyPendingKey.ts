"use server";
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { addMinutes, isAfter } from "date-fns";
import { db } from "~/server/db";
import { sendPendingKeyReturn } from "~/utils/email";

export const checkAndNotifyPendingKeyReturns = async () => {
    try {
      const roomSchedules = await db.roomSchedule.findMany({
        include: {
          roomScheduleRecords: true,
          faculty: true,
          room: true,
        },
      });
  
      const now = new Date();
  
      for (const schedule of roomSchedules) {
        const { roomScheduleRecords, faculty, room, endTime } = schedule;
  
        for (const record of roomScheduleRecords) {
          if (record.notificationSent) continue;
  
          if (!record.timeOut && isAfter(now, addMinutes(new Date(endTime), 15))) {
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
  
