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

    // Use Promise.all to fetch existing user and invitation status concurrently
    const [existingUser, alreadyInvited] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      // find creationToken with same email and not expired.
      db.creationToken.findFirst({
        where: { identifier: email },
      }),
    ]);

    if (existingUser) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this email already exists",
        },
        { status: 409 },
      );
    }

    // If there's a token but it's expired, delete it
    if (alreadyInvited && alreadyInvited.expires < new Date()) {
      await db.creationToken.delete({
        where: { identifier: alreadyInvited.identifier },
      });
    } else if (alreadyInvited) {
      // If token exists and is not expired, return conflict
      return NextResponse.json(
        {
          user: null,
          message: "Invitation for this email has already been sent",
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

    // Send the invitation email asynchronously
    sendInvitationLink(email, token).catch((error) => {
      console.error("Failed to send invitation email:", error);
    });

    return NextResponse.json(
      {
        user: invitation,
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      {
        message: "An error occurred while processing the request",
      },
      { status: 500 },
    );
  }
}
