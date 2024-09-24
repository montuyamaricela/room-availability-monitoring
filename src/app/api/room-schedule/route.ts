/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { error } from "console";
import { format, parse } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { isOverlapping, parseTime } from "~/lib/timeSchedule";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log(body);

    const room = await db.room.findUnique({
      where: { id: body.roomId },
    });
    // update room status
    if (body.isTemp && body.action === "Added temporary schedule") {
      if (room) {
        const createRoomSchedule = async () => {
          // Fetch existing schedules for the same room and day
          const existingSchedules = await db.roomSchedule.findMany({
            where: {
              roomId: room.id,
              day: body.Day,
            },
          });
          // Check for overlaps with existing schedules
          const hasOverlap = existingSchedules.some((existingSchedule) =>
            isOverlapping(
              parseTime(convertToTimeFormat(body.beginTime)),
              parseTime(convertToTimeFormat(body.endTime)),
              existingSchedule.beginTime,
              existingSchedule.endTime,
            ),
          );

          if (hasOverlap) {
            throw new Error("Time conflict. Please try again.");
          }

          await db.roomSchedule.create({
            data: {
              roomId: room.id,
              facultyName: body.facultyName,
              courseCode: body.Subject,
              section: body.Section,
              day: body.Day,
              beginTime: parseTime(convertToTimeFormat(body.beginTime)),
              endTime: parseTime(convertToTimeFormat(body.endTime)),
              isTemp: body.isTemp,
            },
          });
        };

        // Call the createRoomSchedule function
        await createRoomSchedule();
        // await db.roomSchedule.create({
        //   data: {
        //     roomId: room.id,
        //     facultyName: body.facultyName,
        //     courseCode: body.Subject,
        //     section: body.Section,
        //     day: body.Day,
        //     beginTime: parseTime(convertToTimeFormat(body.beginTime)),
        //     endTime: parseTime(convertToTimeFormat(body.endTime)),
        //     isTemp: body.isTemp,
        //   },
        // });
      }
    } else {
      if (room && body.action === "Add Schedule") {
        const createRoomSchedule = async () => {
          // Fetch existing schedules for the same room and day
          const existingSchedules = await db.roomSchedule.findMany({
            where: {
              roomId: room.id,
              day: body.Day,
            },
          });

          // Check for overlaps with existing schedules
          const hasOverlap = existingSchedules.some((existingSchedule) =>
            isOverlapping(
              parseTime(convertToTimeFormat(body.beginTime)),
              parseTime(convertToTimeFormat(body.endTime)),
              existingSchedule.beginTime,
              existingSchedule.endTime,
            ),
          );

          if (hasOverlap) {
            throw new Error("Time conflict. Please try again.");
          }

          await db.roomSchedule.create({
            data: {
              roomId: room.id,
              facultyName: body.facultyName,
              courseCode: body.Subject,
              section: body.Section,
              day: body.Day,
              beginTime: parseTime(convertToTimeFormat(body.beginTime)),
              endTime: parseTime(convertToTimeFormat(body.endTime)),
              isTemp: body.isTemp,
            },
          });
        };

        // Call the createRoomSchedule function
        await createRoomSchedule();
      }

      if (body.isTemp && body.action === "Time out") {
        // delete the temporary schedule after time out.
        await db.roomSchedule.delete({
          where: {
            id: body.id,
          },
        });
      }

      // update room status
      await db.room.update({
        where: {
          id: body.roomId,
        },
        data: {
          status: body.action === "Time in" ? "OCCUPIED" : "AVAILABLE",
        },
      });
    }
    // create room activty log only if the post req is not for adding perm sched
    if (body.action != "Add Schedule") {
      await db.activityLogs.create({
        data: {
          careOf: body.careOf,
          facultyName: body.facultyName,
          roomId: body.roomId,
          loggedBy: session.user.name,
          activity: body.action,
        },
      });
    }

    return NextResponse.json({
      message: `${body.action} successfully!`,
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error processing schedule:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 },
      );
    }
  }
}
function convertToTimeFormat(timeStr: string) {
  const parsedTime = parse(timeStr, "hh:mm a", new Date());
  return format(parsedTime, "HH:mm:ss");
}
