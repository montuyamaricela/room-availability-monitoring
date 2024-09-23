/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { format, parse } from "date-fns";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { parseTime } from "../upload/route";

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
      }
    } else {
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
    // create room activty log
    await db.activityLogs.create({
      data: {
        careOf: body.careOf,
        facultyName: body.facultyName,
        roomId: body.roomId,
        loggedBy: session.user.name,
        activity: body.action,
      },
    });
    return NextResponse.json({
      message: `${body.action} successfully!`,
      status: 200,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: `Something went wrong.: ${error}` },
      { status: 500 },
    );
  }
}
function convertToTimeFormat(timeStr: string) {
  const parsedTime = parse(timeStr, "hh:mm a", new Date());
  return format(parsedTime, "HH:mm:ss");
}
