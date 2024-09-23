/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const scheduleRouter = createTRPCRouter({
  getAllFaculty: protectedProcedure.query(({ ctx }) => {
    // Check if the user is an admin
    return ctx.db.roomSchedule.findMany({
      orderBy: { facultyName: "asc" },
      select: {
        facultyName: true,
      },
    });
  }),

  getRoomSchedule: protectedProcedure
    .input(z.object({ room: z.string().min(1), day: z.string().min(1) })) // Validate that 'room' is a non-empty string
    .mutation(async ({ ctx, input }) => {
      const schedule = await ctx.db.roomSchedule.findMany({
        where: { roomId: input.room, day: input.day }, // Corrected to directly reference 'roomId'
        orderBy: {
          beginTime: "asc",
        },
        include: {
          room: {
            select: {
              roomName: true,
              building: true,
            },
          },
        },
      });

      if (!schedule) {
        throw new Error("Schedule not found"); // Error handling if no schedule is found
      }

      return schedule; // Return the schedule if found
    }),

  getAllSchedule: protectedProcedure.query(({ ctx }) => {
    // Check if the user is an admin
    return ctx.db.roomSchedule.findMany({
      include: {
        room: {
          select: {
            roomName: true,
            building: true,
          },
        },
      },
    });
  }),
});
