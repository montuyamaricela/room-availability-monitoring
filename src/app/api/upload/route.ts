/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { type NextRequest, NextResponse } from "next/server";
// import csv from "csv-parser";
// import { db } from "~/server/db";
// import { PassThrough } from "stream";
// import { getServerSession } from "next-auth";
// import { authOptions } from "~/server/auth";
// import { isOverlapping, parseTime } from "~/lib/timeSchedule";
// import { format, parse, parseISO } from "date-fns";
// import { formattedRoom, formattedBuilding } from "~/lib/csvLibs";
// import {
//   groupSchedulesByCommonDetails,
//   groupSchedulesByCommonDetailsCSV,
// } from "~/lib/groupSchedule";

// export async function POST(request: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const formData = await request.formData();
//   const file = formData.get("file") as Blob | null;

//   if (!file) {
//     return NextResponse.json(
//       { error: "File blob is required." },
//       { status: 400 },
//     );
//   }

//   try {
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const fileStream = new PassThrough();
//     fileStream.end(buffer);

//     const results: any[] = [];
//     return new Promise<NextResponse>((resolve, reject) => {
//       fileStream
//         .pipe(csv())
//         .on("data", (data) => results.push(data))
//         .on("end", async () => {
//           try {
//             const missingRooms: any[] = [];
//             const groupedSchedules = groupSchedulesByCommonDetailsCSV(results);

//             // Map over results to create promises for fetching rooms and schedules
//             const promises = Object.values(groupedSchedules).map(
//               async (groupedRows: any[]) => {
//                 const mergedRow = { ...groupedRows[0] };
//                 if (groupedRows.length > 1) {
//                   const mergedGroup = groupedRows
//                     .map((row) => row.Section)
//                     .sort((a, b) => {
//                       if (a.includes("Group 1")) return -1;
//                       if (b.includes("Group 1")) return 1;
//                       return a.localeCompare(b);
//                     })
//                     .join(" and ");

//                   mergedRow.section_group = mergedGroup;
//                 }

//                 // get roomId first based on Room name and building from the csv
//                 const getRoomId = await db.room.findFirst({
//                   where: {
//                     roomName: formattedRoom(mergedRow.Room),
//                     building: formattedBuilding(mergedRow.Building),
//                   },
//                 });

//                 // skip processing this row if there's no match id
//                 if (!getRoomId) {
//                   missingRooms.push(
//                     mergedRow.Room + " - " + mergedRow.Building,
//                   );
//                   return;
//                 }

//                 // Fetch the room
//                 const room = await db.room.findUnique({
//                   where: { id: getRoomId.id },
//                 });

//                 if (!room) {
//                   missingRooms.push(
//                     mergedRow.Room + " - " + mergedRow.Building,
//                   );
//                   return;
//                 }

//                 // Fetch existing schedules for the same room and day
//                 const existingSchedules = await db.roomSchedule.findMany({
//                   where: {
//                     roomId: room.id,
//                     day: mergedRow.Day,
//                   },
//                 });

//                 // Check for overlaps with existing schedules
//                 const hasOverlap = existingSchedules.some((existingSchedule) =>
//                   isOverlapping(
//                     parseTime(mergedRow["Start Time"]),
//                     parseTime(mergedRow["End Time"]),
//                     existingSchedule.beginTime,
//                     existingSchedule.endTime,
//                   ),
//                 );

//                 if (hasOverlap) {
//                   console.log(
//                     `Overlapping schedule found for room ${room.id} on ${mergedRow.Day}`,
//                   );
//                   return; // Skip this schedule as it overlaps
//                 }

//                 // Insert the room schedule
//                 await db.roomSchedule.createMany({
//                   data: {
//                     roomId: room.id,
//                     facultyName: mergedRow.Instructor,
//                     courseCode: mergedRow.Course,
//                     section: mergedRow.Section + " " + mergedRow.Group,
//                     day: mergedRow.Day,
//                     beginTime: parseTime(mergedRow["Start Time"]),
//                     department: mergedRow.Department,
//                     endTime: parseTime(mergedRow["End Time"]),
//                     isTemp: false,
//                   },
//                 });
//               },
//             );

//             // Wait for all promises to resolve
//             await Promise.all(promises);

//             // Log any missing rooms
//             if (missingRooms.length > 0) {
//               console.error(`Missing rooms: ${missingRooms.join(", ")}`);
//             }

//             // await db.room.createMany({
//             //   data: results.map((row) => ({
//             //     id: row.id,
//             //     roomName: row.roomName,
//             //     building: row.building,
//             //     floor: row.floor,
//             //     withTv: row.WithTv === "TRUE",
//             //     isLecture: row.isLecture === "TRUE",
//             //     isLaboratory: row.isLaboratory === "TRUE",
//             //     isAirconed: row.isAirconed === "TRUE",
//             //     capacity: parseInt(row.capacity, 10),
//             //     electricFans: parseInt(row.electricFans, 10),
//             //     functioningComputers: parseInt(row.functioningComputers, 10),
//             //     notFunctioningComputers: parseInt(
//             //       row.notFunctioningComputers,
//             //       10,
//             //     ),
//             //     status: row.status,
//             //     disable: row["disable "] === "TRUE",
//             //   })),
//             // });

//             resolve(
//               NextResponse.json(
//                 { message: "Data successfully stored.", data: results },
//                 { status: 200 },
//               ),
//             );
//           } catch (error) {
//             console.error("Error saving data:", error);
//             resolve(
//               NextResponse.json(
//                 { error: "Error saving data" },
//                 { status: 500 },
//               ),
//             );
//           }
//         })
//         .on("error", (error) => {
//           console.error("Error processing CSV file:", error);
//           resolve(
//             NextResponse.json(
//               { error: "Error processing CSV file" },
//               { status: 500 },
//             ),
//           );
//         });
//     });
//   } catch (e) {
//     console.error("Error processing file:", e);
//     return NextResponse.json(
//       { error: "Something went wrong." },
//       { status: 500 },
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import { formattedRoom, formattedBuilding } from "~/lib/csvLibs";
import { groupSchedulesByCommonDetailsCSV } from "~/lib/groupSchedule";
// Define chunk size for batch processing
const CHUNK_SIZE = 20; // Adjust based on your needs

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
            const groupedSchedules = groupSchedulesByCommonDetailsCSV(results);
            const groupedSchedulesArray = Object.values(groupedSchedules);

            // Process the data in batches
            for (let i = 0; i < groupedSchedulesArray.length; i += CHUNK_SIZE) {
              const batch = groupedSchedulesArray.slice(i, i + CHUNK_SIZE);

              const batchPromises = batch.map(async (groupedRows: any[]) => {
                const mergedRow = { ...groupedRows[0] };

                if (groupedRows.length > 1) {
                  const mergedGroup = groupedRows
                    .map((row) => row.Section)
                    .sort((a, b) => {
                      if (a.includes("Group 1")) return -1;
                      if (b.includes("Group 1")) return 1;
                      return a.localeCompare(b);
                    })
                    .join(" and ");
                  mergedRow.section_group = mergedGroup;
                }

                const getRoomId = await db.room.findFirst({
                  where: {
                    roomName: formattedRoom(mergedRow.Room),
                    building: formattedBuilding(mergedRow.Building),
                  },
                });

                if (!getRoomId) {
                  missingRooms.push(
                    mergedRow.Room + " - " + mergedRow.Building,
                  );
                  return;
                }

                const room = await db.room.findUnique({
                  where: { id: getRoomId.id },
                });

                if (!room) {
                  missingRooms.push(
                    mergedRow.Room + " - " + mergedRow.Building,
                  );
                  return;
                }

                const existingSchedules = await db.roomSchedule.findMany({
                  where: {
                    roomId: room.id,
                    day: mergedRow.Day,
                  },
                });

                const hasOverlap = existingSchedules.some((existingSchedule) =>
                  isOverlapping(
                    parseTime(mergedRow["Start Time"]),
                    parseTime(mergedRow["End Time"]),
                    existingSchedule.beginTime,
                    existingSchedule.endTime,
                  ),
                );

                if (hasOverlap) {
                  console.log(
                    `Overlapping schedule found for room ${room.id} on ${mergedRow.Day}`,
                  );
                  return; // Skip this schedule as it overlaps
                }

                await db.roomSchedule.createMany({
                  data: {
                    roomId: room.id,
                    facultyName: mergedRow.Instructor,
                    courseCode: mergedRow.Course,
                    section: mergedRow.Section + " " + mergedRow.Group,
                    day: mergedRow.Day,
                    beginTime: parseTime(mergedRow["Start Time"]),
                    department: mergedRow.Department,
                    endTime: parseTime(mergedRow["End Time"]),
                    isTemp: false,
                  },
                });
              });

              // Wait for the current batch to complete
              await Promise.all(batchPromises);

              // Introduce a slight delay to prevent overloading and hitting timeouts
              await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay between chunks
            }

            // Log any missing rooms
            if (missingRooms.length > 0) {
              console.error(`Missing rooms: ${missingRooms.join(", ")}`);
            }

            resolve(
              NextResponse.json(
                { message: "Data successfully stored.", data: results },
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

// await db.room.createMany({
//   data: results.map((row) => ({
//     id: row.id,
//     roomName: row.roomName,
//     building: row.building,
//     floor: row.floor,
//     withTv: row.WithTv === "TRUE",
//     isLecture: row.isLecture === "TRUE",
//     isLaboratory: row.isLaboratory === "TRUE",
//     isAirconed: row.isAirconed === "TRUE",
//     capacity: parseInt(row.capacity, 10),
//     electricFans: parseInt(row.electricFans, 10),
//     functioningComputers: parseInt(row.functioningComputers, 10),
//     notFunctioningComputers: parseInt(
//       row.notFunctioningComputers,
//       10,
//     ),
//     status: row.status,
//     disable: row["disable "] === "TRUE",
//   })),
// });
