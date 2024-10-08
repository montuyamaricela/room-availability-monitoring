/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const logsRouter = createTRPCRouter({
  activityLogs: publicProcedure
    .input(z.object({ userID: z.string().min(1), activity: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.activityLogs.create({
        data: {
          activity: input.activity,
          userId: input.userID,
        },
      });
    }),

  roomLogs: protectedProcedure
    .input(
      z.object({
        loggedBy: z.string().min(1),
        activity: z.string().min(1),
        careOf: z.string(),
        facultyName: z.string(),
        roomId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.roomLogs.create({
        data: {
          activity: input.activity,
          loggedBy: input.loggedBy,
          careOf: input.careOf,
          facultyName: input.facultyName,
          roomId: input.roomId,
        },
      });
    }),

  getActivityLogs: protectedProcedure.query(({ ctx }) => {
    return ctx.db.activityLogs.findMany({
      orderBy: {
        dateTime: "desc",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }),

  getRoomLogs: protectedProcedure.query(({ ctx }) => {
    return ctx.db.roomLogs.findMany({
      orderBy: {
        dateTime: "desc",
      },
    });
  }),
});
