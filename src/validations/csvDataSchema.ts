/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ACCEPTED_FILES = ["text/csv"];

export const csvSchema = z.object({
  category: z.string(),
  file: z
    .any()
    .refine((files) => files?.length === 1, "Cvs is required")
    .refine(
      (files) => ACCEPTED_FILES.includes(files?.[0]?.type),
      "Only CSV files are accepted.",
    ),
});
export type IcsvData = z.infer<typeof csvSchema>;
export const csvDataResolver = zodResolver(csvSchema);
export const csvDataDefaultValues = { category: "", file: [] };
