// @/src/common/validation/auth.ts
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, "Password is Required")
    .min(8, "Password must have atleast 8 characters"),
});

export const signUpSchema = z
  .object({
    email: z
      .string()
      .email("Invalid Email Address")
      .min(1, "Email is required"),
    firstName: z.string().min(3, "First name is required"),
    lastName: z.string().min(3, "Last name is required"),
    role: z.string().min(3, "Role is required"),
    department: z.string(),
    password: z
      .string()
      .min(1, "Password is Required")
      .min(8, "Password must have atleast 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    status: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  })
  .refine(
    (data) => {
      if (data.role === "Admin" && !data.department) {
        return false;
      }
      return true;
    },
    {
      path: ["department"],
      message: "Department is required",
    },
  );

export const createAccountSchema = z
  .object({
    email: z
      .string()
      .email("Invalid Email Address")
      .min(1, "Email is required"),
    firstName: z.string().min(3, "First name is required"),
    lastName: z.string().min(3, "Last name is required"),
    role: z.string().min(3, "Role is required"),
    department: z.string(),
  })
  .refine(
    (data) => {
      if (data.role === "Admin" && !data.department) {
        return false;
      }
      return true;
    },
    {
      path: ["department"],
      message: "Department is required",
    },
  );

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ILogin = z.infer<typeof signinSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
export type ICreateAccount = z.infer<typeof createAccountSchema>;
export type IForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const SigninResolver = zodResolver(signinSchema);
export const SignupResolver = zodResolver(signUpSchema);
export const CreateAccountResolver = zodResolver(createAccountSchema);
export const ForgotPasswordResolver = zodResolver(forgotPasswordSchema);

export const SigninDefaultValues = {
  email: "",
  password: "",
};

export const CreateAccountDefaultValues = {
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  department: "",
};

export const SignupDefaultValues = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  role: "",
  department: "",
  status: "Not Verified",
};

export const forgotPasswordDefaultValue = {
  email: "",
};
