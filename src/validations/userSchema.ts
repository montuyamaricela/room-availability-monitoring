/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ACCEPTED_FILES = ["image/jpeg", "image/png", "image/jpg"];

export const userSchema = z.object({
  firstName: z.string().min(1, "First Name is Required"),
  middleName: z.string(),
  lastName: z.string().min(1, "Last Name is Required"),
  department: z.string(),
  // image: z
  //   .any()
  //   .refine((files) => files?.length === 1, "Image is required") // Ensure that a file is provided
  //   .refine(
  //     (files) => ACCEPTED_FILES.includes(files?.[0]?.type),
  //     "Only JPG, JPEG, and PNG formats are accepted.",
  //   ),
  image: z
    .any() // Use z.any() to accept the file input
    .optional() // Make the image optional
    .refine(
      (files) => {
        // Check if a file is provided and validate its type
        if (files.length === 0) return true; // If no file is provided, validation passes
        if (files.length !== 1) return false; // Ensure only one file is uploaded
        return ACCEPTED_FILES.includes(files[0].type); // Validate file type
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
  image: [], // Default should be null or an empty file object
  email: "",
};
