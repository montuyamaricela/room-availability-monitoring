// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-misused-promises */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-explicit-any */
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
//             await db.room.createMany({
//               data: results.map((row) => ({
//                 id: row.id,
//                 roomName: row.roomName,
//                 building: row.building,
//                 floor: row.floor,
//                 withTv: row.WithTv === "TRUE",
//                 isLecture: row.isLecture === "TRUE",
//                 isLaboratory: row.isLaboratory === "TRUE",
//                 laboratoryType: row.laboratoryType,
//                 isAirconed: row.isAirconed === "TRUE",
//                 capacity: parseInt(row.capacity, 10),
//                 electricFans: parseInt(row.electricFans, 10),
//                 functioningComputers: parseInt(row.functioningComputers, 10),
//                 notFunctioningComputers: parseInt(
//                   row.notFunctioningComputers,
//                   10,
//                 ),
//                 status: row.status,
//                 disable: row["disable "] === "TRUE",
//               })),
//             });

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

const CHUNK_SIZE = 20; 

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
      { status: 400 }
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
            const facultyData = results.map((row) => ({
              facultyName: row.Instructor,
              department: row.Department || "Unknown", 
            }));

            const uniqueFacultyData = Array.from(
              new Map(
                facultyData.map((item) => [item.facultyName, item])
              ).values()
            );

            const facultyMap: Record<string, any> = {};
            for (const { facultyName, department } of uniqueFacultyData) {
              if (!facultyName) continue; 

              let faculty = await db.faculty.findFirst({
                where: { facultyName },
              });

              if (!faculty) {
                faculty = await db.faculty.create({
                  data: {
                    facultyName,
                    email: `${facultyName.replace(/\s+/g, ".")}@example.com`.toLowerCase(),
                    department,
                  },
                });
              }

              facultyMap[facultyName] = faculty.id;
            }

            const missingRooms: string[] = [];
            const groupedSchedules = groupSchedulesByCommonDetailsCSV(results);
            const groupedSchedulesArray = Object.values(groupedSchedules);

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

                const room = await db.room.findFirst({
                  where: {
                    roomName: formattedRoom(mergedRow.Room),
                    building: formattedBuilding(mergedRow.Building),
                  },
                });

                if (!room) {
                  missingRooms.push(
                    `${mergedRow.Room} - ${mergedRow.Building}`
                  );
                  return;
                }

                const facultyID = facultyMap[mergedRow.Instructor];

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
                    existingSchedule.endTime
                  )
                );

                if (hasOverlap) {
                  console.log(
                    `Overlapping schedule found for room ${room.id} on ${mergedRow.Day}`
                  );
                  return;
                }

                await db.roomSchedule.create({
                  data: {
                    roomId: room.id,
                    facultyID,
                    courseCode: mergedRow.Course,
                    section: mergedRow.Section + " " + mergedRow.Group,
                    day: mergedRow.Day,
                    beginTime: parseTime(mergedRow["Start Time"]),
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

            if (missingRooms.length > 0) {
              console.error(`Missing rooms: ${missingRooms.join(", ")}`);
            }

            resolve(
              NextResponse.json(
                { message: "Data successfully stored.", data: results },
                { status: 200 }
              )
            );
          } catch (error) {
            console.error("Error saving data:", error);
            resolve(
              NextResponse.json(
                { error: "Error saving data" },
                { status: 500 }
              )
            );
          }
        })
        .on("error", (error) => {
          console.error("Error processing CSV file:", error);
          resolve(
            NextResponse.json(
              { error: "Error processing CSV file" },
              { status: 500 }
            )
          );
        });
    });
  } catch (e) {
    console.error("Error processing file:", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
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
