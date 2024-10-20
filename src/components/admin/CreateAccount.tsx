/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useEffect, useState } from "react";
import ModalWrapper from "../common/Modal/ModalWrapper";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";
import toast from "react-hot-toast";
import { departments, role } from "../authentications/Signup";
import { useRouter } from "next/navigation";
import { useActivityLog } from "~/lib/createLogs";

export default function CreateAccount({
  firstName,
  lastName,
}: {
  firstName?: string | undefined;
  lastName?: string | undefined;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [disableField, setDisableField] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true); // Track modal open/close state
  const { logActivity } = useActivityLog();

  const form = useForm({
    resolver: authSchema.CreateAccountResolver,
    defaultValues: authSchema.CreateAccountDefaultValues,
  });

  const onSubmit = async (data: authSchema.ICreateAccount) => {
    setIsLoading(true);
    const response = await fetch("/api/invite-user", {
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
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      // delay
      toast.success(
        "Account created successfully! Please check your email for creation link.",
      );
      logActivity(
        firstName + " " + lastName,
        `created an account for ${data?.firstName + " " + data?.lastName}`,
      );
      setTimeout(() => {
        form.reset();
        window.location.reload(); // Hard reload the page
      }, 1000); // 1 seconds delay before redirecting
    } else {
      toast.error(responseData?.message || "Something went wrong");
      console.error("Registration failed");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (form.getValues("role") != "Admin") {
      setDisableField(true);
    } else {
      setDisableField(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("role"), form]);

  return (
    <ModalWrapper
      title="Create Account"
      ButtonTrigger={
        <Button className="ml-auto w-fit bg-green-light hover:bg-green-dark">
          CREATE ACCOUNT
        </Button>
      }
    >
      <div className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
              <FormCombobox
                label="Role"
                form={form}
                placeholder="Select Role"
                name={"role"}
                data={role}
              />

              {disableField ? (
                <FormCombobox
                  disabled
                  label="Department"
                  form={form}
                  placeholder="Select Department"
                  name={"department"}
                  data={departments}
                />
              ) : (
                <FormCombobox
                  label="Department"
                  form={form}
                  placeholder="Select Department"
                  name={"department"}
                  data={departments}
                />
              )}

              <FormInput form={form} name="firstName" label="First Name" />
              <FormInput form={form} name="lastName" label="Last Name" />
              <div className="col-span-2">
                <FormInput form={form} name="email" label="Email" />
              </div>
            </div>
            <div className="mt-5 flex justify-center">
              <Button className="w-3/4 items-center bg-green-dark hover:bg-green-900 sm:w-2/6">
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ModalWrapper>
  );
}
