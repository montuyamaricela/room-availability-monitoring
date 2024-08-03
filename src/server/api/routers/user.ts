/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllUser: protectedProcedure.query(({ ctx }) => {
    // Check if the user is an admin

    if (ctx.session.user.role === "Security Guard") {
      throw new Error("Not authorized");
    }
    return ctx.db.user.findMany({
      orderBy: { firstName: "asc" },
    });
  }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.user.delete({
        where: { id: input?.id },
      });
    }),

  getUserStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        status: user.status,
        email: user.email,
      };
    }),
});
