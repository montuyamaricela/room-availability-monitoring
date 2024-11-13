/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ACCEPTED_FILES = ["image/jpeg", "image/png", "image/jpg"];

export const userSchema = z.object({
  firstName: z.string().min(1, "First Name is Required"),
  middleName: z.string(),
  lastName: z.string().min(1, "Last Name is Required"),
  department: z.string(),
  image: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (files.length === 0) return true;
        if (files.length !== 1) return false;
        return ACCEPTED_FILES.includes(files[0].type);
      },
      {
        message: "Only JPG, JPEG, and PNG formats are accepted.",
      },
    ),
  email: z.string().email("Invalid Email Address").min(1, "Email is Required"),
});

export type IuserSchema = z.infer<typeof userSchema>;
export const userSchemaResolver = zodResolver(userSchema);

export const userDefaultValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  department: "",
  image: [],
  email: "",
};
