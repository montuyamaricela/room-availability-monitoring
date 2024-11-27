/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { sendPendingKeyReturn } from "~/utils/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, facultyName, roomName, recordId } = body;
    await sendPendingKeyReturn(email, facultyName, roomName);

    await db.roomScheduleRecord.update({
      where: { id: recordId },
      data: { notificationSent: true },
    });
    return NextResponse.json(
      { message: "Notification sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking pending key returns:", error);
    throw new Error("Error checking pending key returns");
  }
}
