import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const FacultySchema = z.object({
  facultyName: z.string().min(1, "Faculty Name is required"),
  email: z.string().min(1, "Email Address is required"),
  department: z.string().min(1, "Department is required"),
});

export type IFaculty = z.infer<typeof FacultySchema>;
export const FacultyResolver = zodResolver(FacultySchema);
export const FacultyDefaultValues = {
  facultyName: "",
  email: "",
  department: "",
};
