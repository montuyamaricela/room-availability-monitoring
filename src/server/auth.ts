import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { AdapterUser, type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

export interface CustomUser {
  id: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  department: string;
  image: string;
  role?: "Admin" | "Security Guard" | "Super Admin"; // Define roles
}

// Extend session type to include custom user
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: CustomUser;
  }

  // AdapterUser is used for the database models, so you don't need to extend it here
}
interface CustomCredentials {
  email: string;
  password: string;
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          email: token.email!,
          firstName: token.firstName,
          middleName: token.middleName,
          lastName: token.lastName,
          department: token.department,
          image: token.image,
          role: token.role as string,
        } as CustomUser,
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as CustomUser).id;
        token.email = (user as CustomUser).email;
        token.firstName = (user as CustomUser).firstName;
        token.middleName = (user as CustomUser).middleName;
        token.lastName = (user as CustomUser).lastName;
        token.department = (user as CustomUser).department;
        token.image = (user as CustomUser).image;
        token.role = (user as CustomUser).role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials: CustomCredentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password,
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          middleName: existingUser.middleName,
          lastName: existingUser.lastName,
          department: existingUser?.department,
          image: existingUser?.image,
          role: existingUser.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment variables
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
