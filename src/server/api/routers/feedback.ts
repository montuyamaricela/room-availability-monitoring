import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  createFeedback: protectedProcedure
    .input(
      z.object({
        department: z.string().min(1),
        feedback: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.feedbacks.create({
        data: {
          department: input.department,
          message: input.feedback,
        },
      });
    }),

  getAllFeedback: protectedProcedure.query(async ({ ctx }) => {
    const feedback = await ctx.db.feedbacks.findMany({
      orderBy: {
        dateTime: "desc",
      },
    });

    return {
      data: feedback,
    };
  }),

  acknowledgeFeedback: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        acknowledged: z.boolean(),
        acknowledgedBy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.feedbacks.update({
        where: {
          id: input.id,
        },
        data: {
          acknowledgeBy: input.acknowledgedBy,
          acknowledged: input.acknowledged,
        },
      });
    }),
});
