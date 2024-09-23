/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import csv from "csv-parser";
import { db } from "~/server/db";
import { PassThrough } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { isOverlapping } from "~/lib/timeSchedule";
import { format, parse, parseISO } from "date-fns";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const category = formData.get("category") as string | null;
  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileStream = new PassThrough();
    fileStream.end(buffer);

    const results: any[] = [];
    return new Promise<NextResponse>((resolve, reject) => {
      fileStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            if (category?.toLowerCase() === "room") {
              await db.room.createMany({
                data: results.map((row) => ({
                  id: row.id,
                  roomName: row.roomName,
                  building: row.building,
                  floor: row.floor,
                  withTv: row.WithTv === "TRUE",
                  isLecture: row.isLecture === "TRUE",
                  isLaboratory: row.isLaboratory === "TRUE",
                  isAirconed: row.isAirconed === "TRUE",
                  capacity: parseInt(row.capacity, 10),
                  electricFans: parseInt(row.electricFans, 10),
                  functioningComputers: parseInt(row.functioningComputers, 10),
                  notFunctioningComputers: parseInt(
                    row.notFunctioningComputers,
                    10,
                  ),
                  status: row.status,
                  disable: row.disable === "TRUE",
                })),
              });
            } else if (category?.toLowerCase() === "schedule") {
              const missingRooms = [];
              const missingFaculties = [];

              for (const row of results) {
                // Fetch the room
                const room = await db.room.findUnique({
                  where: { id: row.roomID },
                });

                if (!room) {
                  missingRooms.push(row.roomID);
                  continue;
                }

                // Fetch existing schedules for the same room and day
                const existingSchedules = await db.roomSchedule.findMany({
                  where: {
                    roomId: room.id,
                    day: row.day,
                  },
                });

                // Check for overlaps with existing schedules
                const hasOverlap = existingSchedules.some((existingSchedule) =>
                  isOverlapping(
                    row.beginTime,
                    row.endTime,
                    existingSchedule.beginTime,
                    existingSchedule.endTime,
                  ),
                );

                if (hasOverlap) {
                  console.log(
                    `Overlapping schedule found for room ${room.id} on ${row.day}`,
                  );
                  continue; // Skip this schedule as it overlaps
                }

                // Insert the room schedule
                await db.roomSchedule.create({
                  data: {
                    roomId: room.id,
                    facultyName: row.facultyName,
                    courseCode: row.courseCode,
                    section: row.section,
                    day: row.day,
                    beginTime: parseTime(row.beginTime),
                    endTime: parseTime(row.endTime),
                    isTemp: false,
                  },
                });
              }

              if (missingRooms.length > 0) {
                console.error(`Missing rooms: ${missingRooms.join(", ")}`);
              }
            }

            resolve(
              NextResponse.json(
                { message: "Data successfully stored", data: results },
                { status: 200 },
              ),
            );
          } catch (error) {
            console.error("Error saving data:", error);
            resolve(
              NextResponse.json(
                { error: "Error saving data" },
                { status: 500 },
              ),
            );
          }
        })
        .on("error", (error) => {
          console.error("Error processing CSV file:", error);
          resolve(
            NextResponse.json(
              { error: "Error processing CSV file" },
              { status: 500 },
            ),
          );
        });
    });
  } catch (e) {
    console.error("Error processing file:", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
export function parseTime(timeString: any) {
  // Split the time string into components
  const [hours, minutes, seconds] = timeString.split(":");

  // Create a new Date object
  const date = new Date();

  // Set the time on the date object
  date.setUTCHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0)); // If seconds are missing, default to 0.
  return date;
}
