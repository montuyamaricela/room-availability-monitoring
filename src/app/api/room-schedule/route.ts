/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

          let faculty = await db.faculty.findFirst({
            where: { facultyName: body.facultyName },
          });

          if (!faculty) {
            faculty = await db.faculty.create({
              data: {
                facultyName: body.facultyName,
                email:
                  `${body?.facultyName.replace(/\s+/g, ".")}@example.com`.toLowerCase(),
                department: "unknown",
              },
            });
          }

          await db.roomSchedule.create({
            data: {
              roomId: room.id,
              facultyID: faculty.id,
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

          let faculty = await db.faculty.findFirst({
            where: { facultyName: body.facultyName },
          });

          if (!faculty) {
            faculty = await db.faculty.create({
              data: {
                facultyName: body.facultyName,
                email:
                  `${body?.facultyName.replace(/\s+/g, ".")}@example.com`.toLowerCase(),
                department: "unknown",
              },
            });
          }

          await db.roomSchedule.create({
            data: {
              roomId: room.id,
              facultyID: faculty?.id,
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
      } else if (room && body.action === "Update Schedule") {
        const createRoomSchedule = async () => {
          // Fetch existing schedules for the same room and day
          const existingSchedules = await db.roomSchedule.findMany({
            where: {
              roomId: room.id,
              day: body.Day,
              NOT: {
                id: body.scheduleID,
              },
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

          await db.roomSchedule.update({
            where: {
              id: body.scheduleID,
            },
            data: {
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

      if (body.isTemp && body.action === "Returned the key") {
        // delete the temporary schedule after time out.
        await db.roomSchedule.delete({
          where: {
            id: body.id,
          },
        });
      }

      if (body.action != "Update Schedule") {
        // update room status
        await db.room.update({
          where: {
            id: body.roomId,
          },
          data: {
            status:
              body.action === "Borrowed the key" ? "OCCUPIED" : "AVAILABLE",
          },
        });
      }
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
