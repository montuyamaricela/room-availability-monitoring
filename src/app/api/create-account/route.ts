/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/api/verify/route.ts

import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const accountCreationToken = await db.creationToken.findUnique({
      where: { token },
    });

    if (!accountCreationToken || accountCreationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Token expired or invalid" },
        { status: 400 },
      );
    }

    return NextResponse.redirect(new URL(`/signup?token=${token}`, req.url));
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}