/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const rooms = await db.room.findMany();
    if (rooms.length === 0) {
      // If no rooms are found, return a 404 response
      return NextResponse.json(
        { message: "No rooms available." },
        { status: 404 },
      );
    }

    // If rooms are found, return them
    return NextResponse.json({
      rooms,
    });
  } catch (error) {
    console.error("Error Getting data:", error);
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
    const body = await req.json();
    const {
      id,
      Capacity,
      ElectricFan,
      roomName,
      Functioning,
      NonFunctioning,
      Disabled,
      Lecture,
      Laboratory,
      Airconditioned,
      WithTv,
    } = body;
    // check if room exist
    const isRoomExisting = await db.room.findUnique({
      where: {
        id,
      },
    });

    // if room doesn't exist, return error here ->
    if (!isRoomExisting) {
      return NextResponse.json(
        { message: `No room with ${id} match` },
        { status: 404 },
      );
    }

    // otherwise update ->
    await db.room.update({
      where: {
        id: id,
      },
      data: {
        capacity: Capacity,
        electricFans: ElectricFan,
        functioningComputers: Functioning,
        notFunctioningComputers: NonFunctioning,
        isLecture: Lecture,
        isLaboratory: Laboratory,
        isAirconed: Airconditioned,
        withTv: WithTv,
        disable: Disabled,
      },
    });

    return NextResponse.json(
      { message: `Room ${roomName} successfully updated!` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
