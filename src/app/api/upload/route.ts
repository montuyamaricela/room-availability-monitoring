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
import { isOverlapping, parseTime } from "~/lib/timeSchedule";
import { format, parse, parseISO } from "date-fns";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
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
            const missingRooms: any[] = [];

            // Map over results to create promises for fetching rooms and schedules
            const promises = results.map(async (row) => {
              // Fetch the room
              const room = await db.room.findUnique({
                where: { id: row.roomID },
              });

              if (!room) {
                missingRooms.push(row.roomID);
                return; // Skip processing for this row
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
                  parseTime(row.beginTime),
                  parseTime(row.endTime),
                  existingSchedule.beginTime,
                  existingSchedule.endTime,
                ),
              );

              if (hasOverlap) {
                console.log(
                  `Overlapping schedule found for room ${room.id} on ${row.day}`,
                );
                return; // Skip this schedule as it overlaps
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
            });

            // Wait for all promises to resolve
            await Promise.all(promises);

            // Log any missing rooms
            if (missingRooms.length > 0) {
              console.error(`Missing rooms: ${missingRooms.join(", ")}`);
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
