/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as authSchema from "~/validations/authValidationSchema";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Form } from "../ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import Spinner from "../common/Spinner";
import PrivacyPolicy from "../common/Modal/PrivacyPolicy";
import TermsofServices from "../common/Modal/TermsofService";
import { TooltipInformation } from "../common/TooltipInformation";
import { EyeIcon } from "lucide-react";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(true); // Initially loading
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openPrivacyPolicyModal, setOpenPrivacyPolicyModal] =
    useState<boolean>(false);
  const [openTermsofServicesModal, setOpenTermsofServicesModal] =
    useState<boolean>(false);

  const form = useForm({
    resolver: authSchema.SignupResolver,
    defaultValues: authSchema.SignupDefaultValues,
  });

  const getData = api.user.getCreationData.useMutation({
    onSuccess: (data) => {
      setIsTokenValid(true);
      form.setValue("role", data.role);
      form.setValue("department", data.department || "");
      form.setValue("firstName", data.firstName);
      form.setValue("lastName", data.lastName);
      form.setValue("email", data.email);
      setIsLoading(false);
    },
    onError: () => {
      setIsTokenValid(false);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    // Get the token from the URL
    const token = searchParams.get("token");

    if (token) {
      setToken(token);
      getData.mutate({ token });
    } else {
      // No token present in the URL
      setIsTokenValid(false);
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading) {
      if (!isTokenValid) {
        toast.error("Invalid or missing token");
        setTimeout(() => {
          router.push("/");
        }, 3000); // 3 seconds delay before redirecting
      }
    }
  }, [isLoading, isTokenValid, router]);

  const onSubmit = async (data: authSchema.ISignUp) => {
    setFormLoading(true);
    const response = await fetch(`/api/user?token=${token}`, {
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
      toast.success(
        "Account created successfully! Please check your email for verification link.",
      );
      form.reset();
      setTimeout(() => {
        router.push("/signin");
      }, 1500); // 1.5 seconds delay before redirecting
    } else {
      toast.error(responseData?.message || "Something went wrong");
    }
    setFormLoading(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!isTokenValid) {
    // If token is invalid or missing, we will handle this in the useEffect
    return null;
  }

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword((current) => !current);
  };

  return (
    <Container className="my-auto flex items-center bg-[url('/images/background/bsu.png')] md:h-screen overflow-auto">
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
              Welcome to the BulSU Bustos Campus Room Availability Monitoring
              System. Easily check the status of classrooms in real-time to plan
              your activities more efficiently.
            </p>
          </div>
          <div className="rounded-b-2xl bg-white md:w-1/2 md:rounded-r-2xl md:rounded-bl-none">
            <div className="flex h-full w-full items-center justify-center p-8 sm:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
                    <FormCombobox
                      label="Role"
                      form={form}
                      placeholder="Select Role"
                      name={"role"}
                      data={role}
                      disabled
                    />
                    <FormCombobox
                      label="Department"
                      form={form}
                      placeholder="Select Department"
                      name={"department"}
                      data={departments}
                      disabled
                    />
                    <FormInput
                      form={form}
                      name="firstName"
                      label="First Name"
                    />
                    <FormInput form={form} name="lastName" label="Last Name" />
                    <div className="col-span-2">
                      <FormInput
                        form={form}
                        name="email"
                        label="Email"
                        disabled
                      />
                    </div>
                    <div className="relative">
                      <div className="mt-[-6px]">
                        <label
                          htmlFor="password"
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          Password
                          <div>
                            <TooltipInformation>
                              <p>
                              Your password must contain: <br />
                              At least 8 characters
                              </p>
                            </TooltipInformation>
                          </div>
                        </label>
                        <FormInput
                          form={form}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          label=""
                        />
                      </div>
                      <EyeIcon
                        onClick={togglePassword}
                        className={`absolute right-3 top-8 z-40 h-5 w-5 cursor-pointer ${showPassword ? "text-black" : "text-primary-gray"}`}
                      />
                    </div>
                    <div className="relative">
                      <FormInput
                        form={form}
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                      />
                      <EyeIcon
                        onClick={toggleConfirmPassword}
                        className={`absolute right-3 top-8 z-40 h-5 w-5 cursor-pointer ${showConfirmPassword ? "text-black" : "text-primary-gray"}`}
                      />
                    </div>
                  </div>

                  <p className="mb-5 text-xs font-medium text-gray-dark">
                    By clicking Create, you agree to our Terms of Service and
                    Privacy Policy
                  </p>
                  <div className="flex justify-center">
                    <Button className="w-2/6 items-center bg-green-dark hover:bg-green-900">
                      {formLoading ? "Submitting...." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex items-center justify-center gap-10 text-sm text-white">
        <Button
          onClick={() => setOpenTermsofServicesModal(true)}
          className="bg-transparent hover:bg-transparent"
        >
          Terms of Service
        </Button>
        <Button
          onClick={() => setOpenPrivacyPolicyModal(true)}
          className="bg-transparent hover:bg-transparent"
        >
          Privacy Policy
        </Button>
      </div>
      <div>
        <TermsofServices
          open={openTermsofServicesModal}
          setOpen={setOpenTermsofServicesModal}
        />
        <PrivacyPolicy
          open={openPrivacyPolicyModal}
          setOpen={setOpenPrivacyPolicyModal}
        />
      </div>
    </Container>
  );
}

export const role = [
  { label: "Admin", value: "Admin" },
  { label: "Security Guard", value: "Security Guard" },
];

export const departments = [
  { label: "IE", value: "IE" },
  { label: "CE", value: "CE" },
  { label: "CIT", value: "CIT" },
  { label: "CICS", value: "CICS" },
  { label: "BA", value: "BA" },
  { label: "COED", value: "COED" },
  { label: "LSS", value: "LSS" },
];
