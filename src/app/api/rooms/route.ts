import { NextResponse, type NextRequest } from "next/server";

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
      rooms: rooms,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
