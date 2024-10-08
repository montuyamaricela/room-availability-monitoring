import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const roomSchedule = await db.roomSchedule.findMany({
      orderBy: {
        beginTime: "asc",
      },
      include: {
        room: {
          select: {
            roomName: true,
            building: true,
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
