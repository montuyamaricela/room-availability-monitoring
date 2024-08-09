import { db } from "~/server/db";

export async function getUserByEmail({ email }: { email: string }) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
}
