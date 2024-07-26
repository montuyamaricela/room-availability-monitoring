"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
// import { Form } from "../ui/form";
// import { FormInput } from "../ui/form-components";
// import { Button } from "../ui/button";

export default function Changepassword() {
  return (
    <Container className="my-auto flex h-screen items-center bg-primary-green">
      <div className="flex justify-center items-center ">
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="rounded-b-2xl  bg-white md:w-1/2 md:rounded-r-2xl md:rounded-bl-none">
            <div className="flex h-full w-full  items-center justify-center p-8 sm:p-10">
              {/* Uncomment mo nalang pag gagamitin mo na */}
              {/* <Form {...form}>
                <form className="w-full space-y-5">
                  <FormInput
                    form={form}
                    name="current"
                    type="password"
                    label="Current Password"
                  />

                  <FormInput
                    form={form}
                    name="new"
                    type="password"
                    label="New Password"
                  />

                  <FormInput
                    form={form}
                    name="confirm"
                    type="password"
                    label="Confirm Password"
                  />

                  <div className="flex justify-center">
                    <Button className="w-3/4 items-center bg-green-dark hover:bg-green-900 sm:w-2/6">
                      CHANGE
                    </Button>
                  </div>
                </form>
              </Form> */}
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