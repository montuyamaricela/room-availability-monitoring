"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { signOut, useSession } from "next-auth/react";
import { useActivityLog } from "~/lib/createLogs";
import PrivacyPolicy from "../common/Modal/PrivacyPolicy";
import TermsofServices from "../common/Modal/TermsofService";
// import { Form } from "../ui/form";
// import { FormInput } from "../ui/form-components";
// import { Button } from "../ui/button";

export default function Changepassword() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { logActivity } = useActivityLog();
  const [openPrivacyPolicyModal, setOpenPrivacyPolicyModal] =
    useState<boolean>(false);
  const [openTermsofServicesModal, setOpenTermsofServicesModal] =
    useState<boolean>(false);

  const resetPass = api.user.changePassword.useMutation({
    onSuccess: () => {
      logActivity(
        session.data?.user.firstName + " " + session?.data?.user?.lastName ||
          "",
        "changed their password",
      );
      setTimeout(() => {
        toast.success("Successfully updated password");
        void signOut();
      }, 1000); // 3 seconds delay before redirecting
    },
    onError: (error) => {
      toast.error(error.message);
      setIsLoading(false);
    },
  });

  const resetPasswordHanlder = () => {
    if (password === "" || confirmPassword === "" || oldPassword === "") {
      toast.error("Password fields are required. Please try again");
    } else if (password.length < 8 || confirmPassword.length < 8) {
      toast.error("Password must have atleast 8 characters");
    } else if (password != confirmPassword) {
      toast.error("Password does not match. Please try again.");
    } else if (oldPassword === password) {
      toast.error(
        "New password can't be the same as the old one. Please try again.",
      );
    } else {
      setIsLoading(true);
      if (session.data?.user?.id) {
        const userID = session.data?.user?.id;
        resetPass.mutate({ id: userID, oldPassword, newPassword: password });
      }
    }
  };

  return (
    <Container className="my-auto flex h-screen items-center bg-primary-green overflow-auto">
      <div className="flex items-center justify-center">
        <div className="flex w-full flex-col rounded-lg shadow-lg md:flex-row xl:w-4/5">
          <div className="flex flex-col items-center gap-2 rounded-t-2xl bg-gradient-to-b from-green-400 to-green-800 p-8 drop-shadow-md sm:gap-5 sm:p-10 md:w-1/2 md:items-start md:rounded-l-2xl md:rounded-tr-none lg:p-16">
            <Image
              src={logo}
              alt="BulSULogo"
              width={150}
              className="w-28 sm:w-32 md:w-44"
            />
            <p className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              CHANGE PASSWORD
            </p>
            <p className="font-500 text-center text-sm text-white md:text-left">
              Welcome to the BulSU Bustos Campus Room Availability Monitoring
              System. Easily check the status of classrooms in real-time to plan
              your activities more efficiently.
            </p>
          </div>
          <div className="rounded-b-2xl  bg-white md:w-1/2 md:rounded-r-2xl md:rounded-bl-none">
            <div className="flex h-full w-full flex-col justify-center gap-5 p-8 sm:p-10">
              <div className="">
                <Label>Old Password</Label>
                <Input
                  name="password"
                  type="password"
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div className="">
                <Label>New Password</Label>
                <Input
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="">
                <Label>Confirm New Password</Label>
                <Input
                  name="confirm password"
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={resetPasswordHanlder}
                  className="w-3/4 items-center bg-green-dark hover:bg-green-900 sm:w-2/6"
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-10 text-sm text-white">
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
