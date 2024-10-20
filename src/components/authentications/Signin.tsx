/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { Button } from "../ui/button";
import * as authSchema from "../../validations/authValidationSchema";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { FormInput } from "../ui/form-components";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useActivityLog } from "~/lib/createLogs";
import ForgotPasswordModal from "../common/Modal/ForgotPasswordModal";
import { EyeIcon } from "lucide-react";
import PrivacyPolicy from "../common/Modal/PrivacyPolicy";
import TermsofServices from "../common/Modal/TermsofService";

export default function Signin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { logActivity } = useActivityLog();
  const [openPrivacyPolicyModal, setOpenPrivacyPolicyModal] =
    useState<boolean>(false);
  const [openTermsofServicesModal, setOpenTermsofServicesModal] =
    useState<boolean>(false);

  const form = useForm({
    resolver: authSchema.SigninResolver,
    defaultValues: authSchema.SigninDefaultValues,
  });

  const getStatus = api.user.getUserStatus.useMutation({
    onSuccess: (data) => {
      if (data.status === "Verified") {
        void handleSignIn(data.name);
      } else {
        toast.error(
          "Email is not yet verified. Please verify your email and try again.",
        );
        setIsLoading(false);
      }
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error fetching user status:", error);
      setIsLoading(false);
    },
  });
  const handleSignIn = async (name: string) => {
    try {
      const signInData = await signIn("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
        redirect: false,
      });

      if (signInData?.error) {
        if (signInData.error.includes("CredentialsSignin")) {
          toast.error("Invalid email or password. Please try again");
        } else {
          toast.error(signInData.error);
        }
      } else {
        toast.success("Signed in successfully!");
        logActivity(name ?? "", "logged In");
      }

      setIsLoading(false);
    } catch (error) {
      toast.error("An error occurred during sign-in.");
      console.error("Error during sign-in:", error);
    }
  };

  const onSubmit = async (data: authSchema.ILogin) => {
    setIsLoading(true);
    getStatus.mutate({ email: data.email });
  };

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  return (
    <Container className="my-auto flex h-screen items-center bg-primary-green">
      <div className="flex items-center justify-center ">
        <div className="flex w-full flex-col rounded-lg shadow-lg md:flex-row xl:w-4/5">
          <div className="flex flex-col items-center gap-2 rounded-t-2xl bg-gradient-to-b from-green-400 to-green-800 p-8 drop-shadow-md sm:gap-5 sm:p-10 md:w-1/2 md:items-start md:rounded-l-2xl md:rounded-tr-none lg:p-16">
            <Image
              src={logo}
              alt="BulSULogo"
              width={150}
              className="w-28 sm:w-32 md:w-44"
            />
            <p className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              LOGIN
            </p>
            <p className="font-500 text-center text-sm text-white md:text-left">
              Welcome to the BulSU Bustos Campus Room Availability Monitoring
              System. Easily check the status of classrooms in real-time to plan
              your activities more efficiently.
            </p>
          </div>
          <div className="rounded-b-2xl  bg-white md:w-1/2 md:rounded-r-2xl md:rounded-bl-none">
            <div className="flex h-full w-full  items-center justify-center p-8 sm:p-10">
              <Form {...form}>
                <form
                  className="w-full space-y-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormInput form={form} name="email" label="Email" />
                  <div className="relative">
                    <FormInput
                      form={form}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                    />
                    <EyeIcon
                      onClick={togglePassword}
                      className={`absolute right-3 top-8 z-40 h-5 w-5 cursor-pointer ${showPassword ? "text-black" : "text-primary-gray"}`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <h3 className="text-right text-sm font-medium text-gray-dark">
                      Forgot password?
                    </h3>
                    <ForgotPasswordModal />
                  </div>

                  <div className="flex justify-center">
                    <Button className="w-3/4 items-center bg-green-dark hover:bg-green-900 sm:w-2/6">
                      {isLoading ? "Logging In...." : "Login"}
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
