import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const logExportSchema = z.object({
  facultyName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  roomID: z.string(),
});

export type ILogExport = z.infer<typeof logExportSchema>;
export const logExportResolver = zodResolver(logExportSchema);
export const LogExportDefaultValues = {
  facultyName: "",
  startDate: "",
  endDate: "",
  roomID: "",
};
