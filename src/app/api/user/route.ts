/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { z } from "zod";
import { randomUUID } from "crypto";
import { sendVerificationEmail } from "~/utils/email";

const signUpSchema = z.object({
  email: z.string().email("Invalid Email Address").min(1, "Email is required"),
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  role: z.string().min(3, "Role is required"),
  department: z.string(),
  password: z
    .string()
    .min(1, "Password is Required")
    .min(8, "Password must have atleast 8 characters"),
  status: z.string(),
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const creationToken = url.searchParams.get("token");

    if (!creationToken) {
      return NextResponse.json({ error: "No token" }, { status: 400 });
    }

    const token = randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    const body = await req.json();
    const { email, password, firstName, lastName, department, role, status } =
      signUpSchema.parse(body);

    // check if email already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this email already exists",
        },
        { status: 409 },
      );
    }

    const hashPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashPassword,
        department,
        role,
        status,
      },
    });

    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    await db.creationToken.delete({
      where: { token: creationToken },
    });

    await sendVerificationEmail(email, token);

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
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
