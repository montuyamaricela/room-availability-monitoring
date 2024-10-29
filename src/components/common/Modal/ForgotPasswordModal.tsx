"use client";
import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

import toast from "react-hot-toast";
import { api } from "~/trpc/react";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function ForgotPasswordModal() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState<boolean>(false);

  const { mutate, isPending } = api.user.createForgotPasswordToken.useMutation({
    onSuccess: () => {
      toast.success("Email has been sent. Please check your inbox.");
      setTimeout(() => {
        window.location.reload(); // Hard reload the page
      }, 1000); //  seconds delay before redirecting
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error fetching user info:", error.message);
    },
  });

  const sendEmail = () => {
    if (isValid) {
      mutate({ email });
    } else {
      toast.error("Please enter valid email address");
    }
  };

  useEffect(() => {
    const isEmailValid = emailRegex.test(email);
    setIsValid(isEmailValid);
  }, [email]);

  return (
    <ModalWrapper
      title="Forgot Password"
      ButtonTrigger={
        <p className="cursor-pointer text-sm font-semibold text-primary-green underline">
          Forgot password?
        </p>
      }
    >
      <div className="p-5">
        <div>
          <Label>Email Address</Label>
          <Input
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={sendEmail}
            disabled={!isValid}
            className=" mt-5 items-center bg-primary-green px-10 hover:bg-green-900"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
