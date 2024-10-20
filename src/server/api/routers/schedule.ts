/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { date, z } from "zod";

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

  deleteSchedule: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.roomSchedule.delete({
        where: { id: input.id },
      });
    }),

  GetScheduleRecord: protectedProcedure.query(({ ctx }) => {
    return ctx.db.roomScheduleRecord.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        roomSchedule: {
          select: {
            roomId: true,
            day: true,
            room: true,
          },
        },
      },
    });
  }),

  TimeIn: protectedProcedure
    .input(
      z.object({
        roomScheduleId: z.number(),
        facultyName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.roomScheduleRecord.create({
        data: {
          facultyName: input.facultyName,
          timeIn: new Date(),
          roomScheduleId: input.roomScheduleId,
          timeOut: null,
        },
      });
    }),

  TimeOut: protectedProcedure
    .input(
      z.object({
        scheduleRecordId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.roomScheduleRecord.update({
        where: {
          id: input.scheduleRecordId,
        },
        data: {
          timeOut: new Date(),
        },
      });
    }),
});
