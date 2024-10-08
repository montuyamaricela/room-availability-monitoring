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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { selectedSchoolYear, selectedSemester } = body;

    if (process.env.BULSU_SMART_SCHEDULE_ENDPOINT === undefined) {
      return NextResponse.json(
        { error: "ENV endpoint missing. " },
        { status: 400 },
      );
    }

    const data = await fetch(process.env.BULSU_SMART_SCHEDULE_ENDPOINT, {
      method: "GET",
    });
    const responseData = await data.json();
    if (data.ok) {
      const missingRooms: any[] = [];

      // Check if responseData is empty
      if (!responseData || responseData.length === 0) {
        return NextResponse.json(
          {
            error:
              "No data available for the specified academic year and semester.",
          },
          { status: 404 }, // Not Found
        );
      }

      // Filter rows based on academic year and semester
      const filteredRows = responseData.filter(
        (row: any) =>
          row.academic_year === selectedSchoolYear &&
          row.semester === selectedSemester,
      );

      // Check if filteredRows is empty
      if (filteredRows.length === 0) {
        return NextResponse.json(
          {
            error: `No data found for the AY ${selectedSchoolYear} and ${selectedSemester} sem`,
          },
          { status: 404 },
        );
      }

      // Process the rows by grouping them first
      const groupedSchedules = groupSchedulesByCommonDetails(filteredRows);
      const groupedSchedulesLength = Object.keys(groupedSchedules).length;

      // Iterate over the grouped schedules
      const promises = Object.values(groupedSchedules).map(
        async (groupedRows: any[]) => {
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

          const getRoomId = await db.room.findFirst({
            where: {
              roomName: formattedRoom(mergedRow.room),
              building: formattedBuilding(mergedRow.room_building),
            },
          });

          // Skip if no room id is found
          if (!getRoomId) {
            missingRooms.push(mergedRow.room + " - " + mergedRow.room_building);
            return;
          }

          const room = await db.room.findUnique({
            where: { id: getRoomId.id },
          });

          if (!room) {
            missingRooms.push(mergedRow.room + " - " + mergedRow.room_building);
            return;
          }

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
            return; // Skip this schedule as it overlaps
          }

          // Insert the room schedule
          await db.roomSchedule.createMany({
            data: {
              roomId: room.id,
              facultyName: mergedRow.instructor,
              courseCode: mergedRow.subject,
              section: mergedRow.section_name + " " + mergedRow.section_group,
              day: mergedRow.day,
              beginTime: parseTime(mergedRow.start_time),
              department: mergedRow.department_code,
              endTime: parseTime(mergedRow.end_time),
              isTemp: false,
            },
          });
        },
      );

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Log any missing rooms
      if (missingRooms.length > 0) {
        console.error(`Missing rooms: ${missingRooms.join(", ")}`);
      }

      const totalSchedulesProcessed =
        groupedSchedulesLength - missingRooms.length; // Calculate successfully processed schedules

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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      { error: `Something went wrong requesting data..` },
      { status: 500 },
    );
  }
}
