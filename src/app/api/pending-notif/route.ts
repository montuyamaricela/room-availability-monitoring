/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { addMinutes, isPast, parse } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import { formatTimetoLocal } from "~/lib/timeSchedule";
import { db } from "~/server/db";
import {  sendPendingKeyReturn } from "~/utils/email";

export async function GET(req: NextRequest) {
  try {
    const roomSchedules = await db.roomSchedule.findMany({
      include: {
        roomScheduleRecords: true,
        faculty: true,
        room: true,
      },
    });

    const emailQueue: { email: string; facultyName: string; roomName: string }[] = [];
    const notificationUpdates: Promise<any>[] = [];
    const feedbackLogs: Promise<any>[] = [];

    for (const schedule of roomSchedules) {
      const { roomScheduleRecords, faculty, room, endTime } = schedule;

      // Parse and format end time
      const formattedEndTime = parse(
        formatTimetoLocal(endTime),
        "h:mm a",
        new Date()
      );
      const gracePeriodEndTime = addMinutes(formattedEndTime, 15);

      for (const record of roomScheduleRecords) {
        if (record.notificationSent) continue;

        if (!record.timeOut && isPast(gracePeriodEndTime)) {
 
          await sendPendingKeyReturn(faculty.email, faculty.facultyName, room.roomName).catch((error) => {
            console.error("Failed to send pending notification email:", error);
          });

          // Queue notification status update
          notificationUpdates.push(
            db.roomScheduleRecord.update({
              where: { id: record.id },
              data: { notificationSent: true },
            })
          );

          // Queue feedback log
          feedbackLogs.push(
            db.feedbacks.create({
              data: {
                department: faculty.department ?? "BSIT (CICS)",
                message: `${faculty.facultyName} did not return the key after their scheduled Time Out at Room ${room.roomName}`,
              },
            })
          );
        }
      }
    }

    // Update records and log feedbacks concurrently
    await Promise.all([...notificationUpdates, ...feedbackLogs]);

    return NextResponse.json(
      { message: "Notifications sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking pending key returns:", error);
    return NextResponse.json(
      { message: "Error checking pending key returns", error },
      { status: 500 }
    );
  }
}