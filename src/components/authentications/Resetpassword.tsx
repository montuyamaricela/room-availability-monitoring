"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { api } from "~/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useActivityLog } from "~/lib/createLogs";
import PrivacyPolicy from "../common/Modal/PrivacyPolicy";
import TermsofServices from "../common/Modal/TermsofService";
import { TooltipInformation } from "../common/TooltipInformation";
import { EyeIcon } from "lucide-react";

export default function Resetpassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logActivity } = useActivityLog();
  const [openPrivacyPolicyModal, setOpenPrivacyPolicyModal] =
    useState<boolean>(false);
  const [openTermsofServicesModal, setOpenTermsofServicesModal] =
    useState<boolean>(false);

  const getData = api.user.getForgotPasswordData.useMutation({
    onSuccess: (data) => {
      setIsTokenValid(true);
      setEmail(data.email);
      setIsLoading(false);
    },
    onError: () => {
      setIsTokenValid(false);
      setIsLoading(false);
    },
  });

  const resetPass = api.user.resetPassword.useMutation({
    onSuccess: (data) => {
      logActivity(data ?? "", "resetted their password");
      setTimeout(() => {
        toast.success("Successfully updated password");
        router.push("/signin");
      }, 1000); // 3 seconds delay before redirecting
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

  const resetPasswordHanlder = () => {
    if (password === "" && confirmPassword === "") {
      toast.error("Password fields are required. Please try again");
    } else if (password.length < 8 || confirmPassword.length < 8) {
      toast.error("Password must have atleast 8 characters");
    } else if (password != confirmPassword) {
      toast.error("Password does not match. Please try again.");
    } else {
      setIsLoading(true);
      resetPass.mutate({ email, password, token });
    }
  };

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword((current) => !current);
  };

  return (
    <Container className="my-auto flex h-screen items-center bg-primary-green overflow-auto">
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
              RESET PASSWORD
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
                <Label>Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  disabled
                  defaultValue={email}
                />
              </div>
              <div className="relative">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    Password
                    <TooltipInformation>
                      <p>
                        Your password must contain: <br />
                        At least 8 characters
                      </p>
                    </TooltipInformation>
                  </Label>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />  
                </div>
                <EyeIcon
                  onClick={togglePassword}
                  className={`absolute right-3 top-8 z-40 h-5 w-5 cursor-pointer ${showPassword ? "text-black" : "text-primary-gray"}`}
                />
              </div>
              <div className="relative">
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    name="confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />  
                </div>
                <EyeIcon
                  onClick={toggleConfirmPassword}
                  className={`absolute right-3 top-8 z-40 h-5 w-5 cursor-pointer ${showConfirmPassword ? "text-black" : "text-primary-gray"}`}
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
