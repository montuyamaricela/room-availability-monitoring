import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const roomSchedule = await db.roomSchedule.findMany({
      include: {
        room: {
          select: {
            roomName: true,
            building: true,
          },
        },
        faculties: {
          select: {
            department: true,
          },
        },
      },
    });
    if (roomSchedule.length === 0) {
      // If no rooms are found, return a 404 response
      return NextResponse.json(
        { message: "No rooms available." },
        { status: 404 },
      );
    }

    // If rooms are found, return them
    return NextResponse.json({
      data: roomSchedule,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const deleteSchedule = await db.roomSchedule.deleteMany();

    if (!deleteSchedule) {
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Schedule successfully deleted",
      status: 200,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}