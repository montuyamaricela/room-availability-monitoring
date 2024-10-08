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
    .min(8, "Password must have at least 8 characters"),
  status: z.string(),
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const creationToken = url.searchParams.get("token");

    if (!creationToken) {
      return NextResponse.json({ error: "No token" }, { status: 400 });
    }

    // Parse request body
    const body = await req.json();
    const { email, password, firstName, lastName, department, role, status } =
      signUpSchema.parse(body);

    // Check if the email is already taken
    const existingUser = await db.user.findUnique({
      where: { email },
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

    // Hash password (slow process but async)
    const hashPassword = await hash(password, 10);

    // Create a new user in the database
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

    // Generate verification token and expiration time
    const token = randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Perform DB operations concurrently to improve speed
    await Promise.all([
      db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      }),
      db.creationToken.delete({
        where: { token: creationToken },
      }),
    ]);

    // Send verification email asynchronously
    sendVerificationEmail(email, token).catch((error) => {
      console.error("Failed to send verification email:", error);
    });

    // Return response while email is being sent
    const { password: newUserPassword, ...rest } = newUser; // Exclude the password from the response

    return NextResponse.json(
      {
        user: rest,
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during sign-up process:", error);
    return NextResponse.json(
      {
        message: "An error occurred during sign-up.",
      },
      { status: 500 },
    );
  }
}
