/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
const currentDate = new Date();

export const ScheduleSchema = z.object({
  facultyName: z.string().min(3, "Faculty name is required"),
  Section: z.string(),
  CourseCode: z.string(),
  Room: z.string(),
  Day: z.string(),
  beginTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "Begin time is required"),
});
export type IScheduleSchema = z.infer<typeof ScheduleSchema>;
export const ScheduleSchemaResolver = zodResolver(ScheduleSchema);
export const ScheduleSchemaDefaultValues = {
  facultyName: "",
  Section: "",
  CourseCode: "",
  Room: "",
  Day: format(currentDate, "EEEE"),
  beginTime: "",
  endTime: "",
};