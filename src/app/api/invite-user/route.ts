/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { z } from "zod";
import { randomUUID } from "crypto";
import { sendInvitationLink } from "~/utils/email";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

const inviteSchema = z.object({
  email: z.string().email("Invalid Email Address").min(1, "Email is required"),
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  role: z.string().min(3, "Role is required"),
  department: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    const body = await req.json();
    const { email, firstName, lastName, department, role } =
      inviteSchema.parse(body);

    // check if email already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    const alreadyInvited = await db.creationToken.findUnique({
      where: {
        identifier: email,
      },
    });

    if (existingUser ?? alreadyInvited) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this email already exists",
        },
        { status: 409 },
      );
    }

    const invitation = await db.creationToken.create({
      data: {
        identifier: email,
        firstName,
        lastName,
        role,
        department,
        token,
        expires,
      },
    });

    await sendInvitationLink(email, token);

    return NextResponse.json(
      {
        user: invitation,
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 },
    );
  }
}
