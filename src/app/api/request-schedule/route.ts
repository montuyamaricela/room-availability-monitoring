/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { formattedBuilding, formattedRoom } from "~/lib/csvLibs";
import { groupSchedulesByCommonDetails } from "~/lib/groupSchedule";
import { isOverlapping, parseTime } from "~/lib/timeSchedule";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

interface FacultyData {
  facultyName: string;
  department: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { selectedSchoolYear, selectedSemester } = body;

    if (!process.env.BULSU_SMART_SCHEDULE_ENDPOINT) {
      return NextResponse.json(
        { error: "ENV endpoint missing." },
        { status: 400 },
      );
    }

    const data = await fetch(process.env.BULSU_SMART_SCHEDULE_ENDPOINT, {
      method: "GET",
    });
    const responseData = await data.json();

    if (data.ok) {
      const missingRooms: string[] = [];

      if (!responseData || responseData.length === 0) {
        return NextResponse.json(
          {
            error:
              "No data available for the specified academic year and semester.",
          },
          { status: 404 },
        );
      }

      // Filter rows based on the selected academic year and semester
      const filteredRows = responseData.filter(
        (row: any) =>
          row.academic_year === selectedSchoolYear &&
          row.semester === selectedSemester,
      );

      if (filteredRows.length === 0) {
        return NextResponse.json(
          {
            error: `No data found for the AY ${selectedSchoolYear} and ${selectedSemester} sem`,
          },
          { status: 404 },
        );
      }

      const facultyData: FacultyData[] = filteredRows.map((row: any) => ({
        facultyName: row.instructor as string,
        department: (row.department_code as string) || "Unknown", 
      }));

      const uniqueFacultyData: FacultyData[] = Array.from(
        new Map(
          facultyData.map((item) => [item.facultyName, item]),
        ).values(),
      );

      const facultyMap: Record<string, any> = {}; 

      for (const { facultyName, department } of uniqueFacultyData) {
        console.log("Processing faculty:", facultyName);

        if (!facultyName) continue; 

        let faculty = await db.faculty.findFirst({
          where: { facultyName },
        });

        if (!faculty) {
          faculty = await db.faculty.create({
            data: {
              facultyName,
              email:
                `${facultyName.replace(/\s+/g, ".")}@example.com`.toLowerCase(),
              department, 
            },
          });
        }

        facultyMap[facultyName] = faculty.id;
      }

      const groupedSchedules = groupSchedulesByCommonDetails(filteredRows);
      const groupedSchedulesLength = Object.keys(groupedSchedules).length;

      const chunkSize = 20; 
      const scheduleEntries = Object.values(groupedSchedules);

      for (let i = 0; i < scheduleEntries.length; i += chunkSize) {
        const scheduleChunk = scheduleEntries.slice(i, i + chunkSize);

        const promises = scheduleChunk.map(async (groupedRows: any[]) => {
          const mergedRow = { ...groupedRows[0] };

          if (groupedRows.length > 1) {
            const mergedGroup = groupedRows
              .map((row) => row.section_group)
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
              roomName: formattedRoom(mergedRow.room),
              building: formattedBuilding(mergedRow.room_building),
            },
          });

          if (!room) {
            missingRooms.push(mergedRow.room + " - " + mergedRow.room_building);
            return;
          }

          const facultyID = facultyMap[mergedRow.instructor];

          const existingSchedules = await db.roomSchedule.findMany({
            where: {
              roomId: room.id,
              day: mergedRow.day,
            },
          });

          const hasOverlap = existingSchedules.some((existingSchedule) =>
            isOverlapping(
              parseTime(mergedRow.start_time),
              parseTime(mergedRow.end_time),
              existingSchedule.beginTime,
              existingSchedule.endTime,
            ),
          );

          if (hasOverlap) {
            console.log(
              `Overlapping schedule found for room ${room.id} on ${mergedRow.day}`,
            );
            return;
          }

          await db.roomSchedule.create({
            data: {
              roomId: room.id,
              facultyID,
              courseCode: mergedRow.subject,
              section: mergedRow.section_name + " " + mergedRow.section_group,
              day: mergedRow.day,
              beginTime: parseTime(mergedRow.start_time),
              endTime: parseTime(mergedRow.end_time),
              isTemp: false,
            },
          });
        });

        await Promise.all(promises);

        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      }

      if (missingRooms.length > 0) {
        console.error(`Missing rooms: ${missingRooms.join(", ")}`);
      }

      const totalSchedulesProcessed =
        groupedSchedulesLength - missingRooms.length;

      return NextResponse.json(
        {
          message: `${totalSchedulesProcessed} schedule(s) successfully stored for ${selectedSchoolYear} - ${selectedSemester}.`,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "An error occurred during requesting data" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: `Something went wrong requesting data..` },
      { status: 500 },
    );
  }
}
