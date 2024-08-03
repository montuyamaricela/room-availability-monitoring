/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as authSchema from "~/validations/authValidationSchema";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Form } from "../ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: authSchema.SignupResolver,
    defaultValues: authSchema.SignupDefaultValues,
  });

  const onSubmit = async (data: authSchema.ISignUp) => {
    setIsLoading(true);
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        department: data.department,
        password: data.password,
        status: "Not Verified",
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      // delay
      toast.success("Account created successfully!");
      setTimeout(() => {
        form.reset();
        router.push("/signin");
      }, 3000); // 3 seconds delay before redirecting
    } else {
      toast.error(responseData?.message || "Something went wrong");
      console.error("Registration failed");
    }
    setIsLoading(false);
  };

  return (
    <Container className="my-auto flex items-center bg-primary-green md:h-screen">
      <div className="flex items-center justify-center ">
        <div className="flex w-full flex-col rounded-lg shadow-lg md:flex-row xl:w-4/5">
          <div className="flex flex-col items-center justify-center gap-2 rounded-t-2xl bg-gradient-to-b from-green-400 to-green-800 p-8 drop-shadow-md sm:gap-5 sm:p-10 md:w-1/2 md:items-start md:rounded-l-2xl md:rounded-tr-none lg:p-16">
            <Image
              src={logo}
              alt="BulSULogo"
              width={150}
              className="w-28 sm:w-32 md:w-44"
            />
            <p className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              CREATE ACCOUNT
            </p>
            <p className="font-500 text-center text-sm text-white md:text-left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="rounded-b-2xl  bg-white md:w-1/2 md:rounded-r-2xl md:rounded-bl-none">
            <div className="flex h-full w-full  items-center justify-center p-8 sm:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-3 sm:grid  sm:grid-cols-2">
                    <FormCombobox
                      label="Role"
                      form={form}
                      placeholder="Select Role"
                      name={"role"}
                      data={role}
                    />
                    <FormCombobox
                      label="Department"
                      form={form}
                      placeholder="Select Department"
                      name={"department"}
                      data={departments}
                    />
                    <FormInput
                      form={form}
                      name="firstName"
                      label="First Name"
                    />
                    <FormInput form={form} name="lastName" label="Last Name" />
                    <div className="col-span-2">
                      <FormInput form={form} name="email" label="Email" />
                    </div>
                    <FormInput
                      form={form}
                      type="password"
                      name="password"
                      label="Password"
                    />
                    <FormInput
                      form={form}
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                    />
                  </div>

                  <h3 className="my-5 text-xs font-medium text-gray-dark">
                    By clicking Create, you agree to our
                    <Link href="#" className="font-semibold text-green-dark">
                      {" "}
                      Terms of Service{" "}
                    </Link>
                    and that you have read our
                    <Link href="#" className="font-semibold text-green-dark">
                      {" "}
                      Privacy Policy
                    </Link>
                  </h3>
                  <div className="flex justify-center">
                    <Button className="w-2/6 items-center bg-green-dark hover:bg-green-900">
                      {isLoading ? "Submitting...." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex items-center justify-center gap-10 text-sm text-white">
        <Link href="#">Terms of Service</Link>
        <Link href="#">Privacy Policy</Link>
      </div>
    </Container>
  );
}

const role = [
  { label: "Admin", value: "Admin" },
  { label: "Security Guard", value: "Security Guard" },
];

const departments = [
  { label: "IE", value: "IE" },
  { label: "CE", value: "CE" },
  { label: "CIT", value: "CIT" },
  { label: "CICS", value: "CICS" },
  { label: "BA", value: "BA" },
  { label: "COED", value: "COED" },
  { label: "LSS", value: "LSS" },
];
