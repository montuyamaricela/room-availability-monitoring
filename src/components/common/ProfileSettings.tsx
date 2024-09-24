"use client";
import { Container } from "../common/Container";
import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import Image from "next/image";
import avatar from "/public/images/avatar/image.png";
import icon from "/public/images/icon/image.png";
import { departments } from "../authentications/Signup";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";

export default function ProfileSettings() {
  const session = useSession();

  const form = useForm({
    resolver: authSchema.CreateAccountResolver,
    defaultValues: authSchema.CreateAccountDefaultValues,
  });

  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full bg-custom-gray px-14 py-10 shadow-lg drop-shadow-md lg:w-4/5 lg:px-24">
          <p className="text-2xl font-semibold text-gray-dark">
            Profile Settings
          </p>
          <Form {...form}>
            <form>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-10">
                <Image src={avatar} alt="Avatar" width={120} />
                <FormInput
                  form={form}
                  name="picture"
                  label="Change Profile Picture"
                  type="file"
                />
                <div className="flex items-center gap-2">
                  <Image src={icon} alt="Information" width={20} />
                  <p className="text-xs text-green-light">
                    Note! Only .jpeg, .jpg and .png images are accepted{" "}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormInput form={form} name="lastName" label="Last Name" />
                <FormInput
                  form={form}
                  name="firstName"
                  label="First Name"
                  // setValue={session?.data?.user.name}
                />
                <FormInput form={form} name="middleName" label="Middle Name" />
                {/* Yung department pahide nalang if security yung gagamit*/}
                <FormCombobox
                  label="Department"
                  form={form}
                  placeholder="Select Department"
                  name={"department"}
                  data={departments}
                />
                <FormInput form={form} name="email" label="Email" />
              </div>
              <Button className="mx-auto mt-6 block items-center bg-green-light font-bold hover:bg-green-900 lg:float-right">
                UPDATE
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Container>
  );
}
