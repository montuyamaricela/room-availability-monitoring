/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { compare, hash } from "bcrypt";
import { randomUUID } from "crypto";
import { getSession, useSession } from "next-auth/react";
import { z } from "zod";
import Resetpassword from "~/components/authentications/Resetpassword";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { sendForgotPasswordLink } from "~/utils/email";

export const userRouter = createTRPCRouter({
  getUserInfo: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { id: input.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          department: true,
          image: true,
          email: true,
        },
      });
    }),
  getAllUser: protectedProcedure.query(({ ctx }) => {
    // Check if the user is an admin

    if (ctx.session.user.role === "Security Guard") {
      throw new Error("Not authorized");
    }
    return ctx.db.user.findMany({
      orderBy: { firstName: "asc" },
    });
  }),

  changePassword: protectedProcedure
    .input(
      z.object({
        id: z.string(), // The user ID
        oldPassword: z.string(), // The old password input by the user
        newPassword: z.string(), // The new password the user wants to set
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find the user in the database by ID
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      const isOldPasswordCorrect = await compare(
        input.oldPassword,
        user.password,
      );

      if (!isOldPasswordCorrect) {
        throw new Error("Old password is incorrect. Please try again.");
      }

      const newHashedPassword = await hash(input.newPassword, 10);

      await ctx.db.user.update({
        where: { id: input.id },
        data: {
          password: newHashedPassword,
        },
      });
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.delete({
        where: { id: input.id },
      });
    }),

    deleteFaculty: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.faculty.delete({
        where: { id: input.id },
      });
    }),

    updateFaculty: protectedProcedure
    .input(z.object({ id: z.number(), facultyName: z.string(), email: z.string(), department: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.faculty.update({
        where: { id: input.id },
        data: {
          facultyName: input.facultyName,
          email: input.email,
          department: input.department
        }
      });
    }),

    createFaculty: protectedProcedure
    .input(z.object({ facultyName: z.string(), email: z.string(), department: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.faculty.create({
        data: {
          facultyName: input.facultyName,
          email: input.email,
          department: input.department
        }
      });
    }),

  getUserStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error("User does not exist");
      }

      return {
        status: user.status,
        email: user.email,
        id: user.id,
        name: user.firstName + " " + user.lastName,
      };
    }),

  getCreationData: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.creationToken.findUnique({
        where: { token: input.token },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        email: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        role: user.role,
      };
    }),

  createForgotPasswordToken: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const token = randomUUID();

      const [existingUser, existingToken] = await Promise.all([
        ctx.db.user.findFirst({ where: { email: input.email } }),
        ctx.db.forgotPasswordToken.findFirst({
          where: { identifier: input.email },
        }),
      ]);

      if (!existingUser) {
        throw new Error("User does not exist.");
      }

      if (existingToken && existingToken.expires < new Date()) {
        await ctx.db.forgotPasswordToken.delete({
          where: { token: existingToken.token },
        });
      }

      if (existingToken && existingToken.expires > new Date()) {
        throw new Error("An email has already been sent.");
      }

      await ctx.db.forgotPasswordToken.create({
        data: {
          identifier: input.email,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      sendForgotPasswordLink(input.email, token)
        .then(() => {
          console.log("Forgot password email sent successfully.");
        })
        .catch((error) => {
          console.error("Failed to send forgot password email:", error);
        });

      return {
        message: "Forgot password token generated successfully.",
      };
    }),

  getForgotPasswordData: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.forgotPasswordToken.findUnique({
        where: { token: input.token },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        email: user.identifier,
      };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashPassword = await hash(input.password, 10);
      const [user, token] = await Promise.all([
        ctx.db.user.update({
          where: { email: input.email },
          data: {
            password: hashPassword,
          },
        }),

        ctx.db.forgotPasswordToken.delete({
          where: {
            token: input.token,
          },
        }),
      ]);

      return user.firstName + " " + user.lastName;
    }),
});
