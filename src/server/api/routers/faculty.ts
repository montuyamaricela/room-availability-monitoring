/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const facultyRouter = createTRPCRouter({
  getAllFaculty: protectedProcedure.query(({ ctx }) => {
    // Check if the user is an admin
    return ctx.db.faculty.findMany({
      orderBy: { facultyName: "asc" },
    });
  }),
});
