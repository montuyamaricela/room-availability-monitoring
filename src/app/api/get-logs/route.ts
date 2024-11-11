/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { roomID, facultyName, startDate, endDate } = body.data;

    // Parse and format startDate and endDate
    const parsedStartDate = startDate
      ? startOfDay(parseISO(startDate))
      : undefined;
    const parsedEndDate = endDate ? endOfDay(parseISO(endDate)) : undefined;

    // Set up filtering conditions
    const whereConditions: Record<string, any> = {
      ...(roomID ? { roomId: roomID } : {}),
      ...(facultyName ? { facultyName } : {}),
      ...(startDate || endDate
        ? {
            dateTime: {
              ...(parsedStartDate ? { gte: parsedStartDate } : {}),
              ...(parsedEndDate ? { lte: parsedEndDate } : {}),
            },
          }
        : {}),
    };

    // Fetch logs based on filtering conditions
    const roomLogs = await db.roomLogs.findMany({
      where: whereConditions,
      orderBy: {
        dateTime: "asc",
      },
    });

    // Merge borrowed and returned logs
    const mergedLogs: any[] = [];
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    const activeBorrows: { [key: string]: any } = {}; // Keep track of active borrow actions by room or faculty if needed

    roomLogs.forEach((log) => {
      const isStudentBorrowingForFaculty =
        log.careOf && log.careOf !== log.facultyName;
      const tempSchedule = log.activity.includes("added temporary schedule");

      if (log.activity === "borrowed the key") {
        // Create a new borrow entry
        const borrowEntry = {
          id: log.id,
          roomId: log.roomId,
          returnedAt: log.dateTime,
          borrowedAt: log.dateTime,
          activity:
            tempSchedule && !isStudentBorrowingForFaculty
              ? `${log.loggedBy} ${log.activity} ${log.facultyName} at Room ${log.roomId}`
              : isStudentBorrowingForFaculty
                ? `${log.careOf} ${log.activity} to Room ${log.roomId} for ${log.facultyName} with assistance from ${log.loggedBy}.`
                : `${log.facultyName} ${log.activity} to Room ${log.roomId} with assistance from ${log.loggedBy}.`,
        };

        // Track this borrow entry by room or faculty to match with returned key later
        activeBorrows[log.roomId] = borrowEntry;
      } else if (
        log.activity === "returned the key" &&
        activeBorrows[log.roomId]
      ) {
        // Complete the last borrow entry by setting return details
        const borrowEntry = activeBorrows[log.roomId];
        borrowEntry.returnedAt = log.dateTime;
        borrowEntry.returnedBy = log.loggedBy;

        mergedLogs.push(borrowEntry); // Move to final list
        delete activeBorrows[log.roomId]; // Remove from active list
      }
    });

    // If there are unmatched borrow entries, add them as well
    for (const remainingBorrow of Object.values(activeBorrows)) {
      mergedLogs.push(remainingBorrow);
    }

    return NextResponse.json({ data: mergedLogs }, { status: 200 });
  } catch (error) {
    console.error("Error getting room logs", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
