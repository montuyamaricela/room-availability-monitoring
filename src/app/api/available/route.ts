import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const updateStatus = await db.room.updateMany({
      where: {
        status: "OCCUPIED",
      },
      data: {
        status: "AVAILABLE",
      },
    });

    if (!updateStatus) {
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
