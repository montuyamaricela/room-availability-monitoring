/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import ImageKit from "imagekit";
import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { randomUUID } from "crypto"; // For generating verification token
import { sendVerificationEmail } from "~/utils/email";
import { signOut } from "next-auth/react";

const prisma = new PrismaClient();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      userID,
      base64Image,
      firstName,
      middleName,
      lastName,
      department,
      email,
    } = body;

    let imageUrl = "";
    let newEmail = false;
    // Fetch current user data
    const currentUser = await prisma.user.findUnique({ where: { id: userID } });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser.email !== email) {
      newEmail = true;

      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
      }

      const token = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await Promise.all([
        prisma.verificationToken.create({
          data: {
            identifier: email,
            token,
            expires,
          },
        }),
        prisma.user.update({
          where: { id: userID },
          data: {
            email,
            status: "Not Verified",
          },
        }),
      ]);

      // Send verification email
      sendVerificationEmail(email, token).catch((error) => {
        console.error("Failed to send verification email:", error);
      });
    }

    // Check if base64Image exists and upload if it does
    if (base64Image) {
      const response = await imagekit.upload({
        file: base64Image,
        fileName: `profile_${userID}`,
      });
      imageUrl = response.url; // Get the URL of the uploaded image
    }

    // Update the user record in the database
    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: {
        image: imageUrl || undefined, // Only update image if imageUrl is defined
        firstName,
        lastName,
        middleName,
        department,
        email: currentUser.email === email ? undefined : email, // Only update if email has changed
      },
    });

    return NextResponse.json(
      {
        message: `User profile updated successfully. ${newEmail ? "Please verify your email again. Thank you" : ""}`,
        user: updatedUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong. ${error}` },
      { status: 500 },
    );
  }
}
