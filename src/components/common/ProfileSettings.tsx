/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { Container } from "../common/Container";
import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import avatar from "/public/images/avatar/image.png";
import {  signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as userSchema from "../../validations/userSchema";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { useUserInfoStore } from "~/store/useUserInfoStore";
import { Label } from "../ui/label";
import { useActivityLog } from "~/lib/createLogs";
import  {TooltipInformation} from "../common/TooltipInformation";
import { departmentList1 } from "./Modal/AddFacultyModal";

export default function ProfileSettings() {
  const session = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>();
  const { user, setUser } = useUserInfoStore();
  const { logActivity } = useActivityLog();

  const form = useForm({
    resolver: userSchema.userSchemaResolver,
    defaultValues: userSchema.userDefaultValues,
  });

  useEffect(() => {
    form.setValue("firstName", user?.firstName ?? "");
    form.setValue("lastName", user?.lastName ?? "");
    form.setValue("middleName", user?.middleName ?? "");
    form.setValue("department", user?.department ?? "");
    form.setValue("email", user?.email ?? "");
    setImagePreview(user?.image);
  }, [form, user]);

  // Watch for changes in the "image" field
  const imageFile = form.watch("image");

  useEffect(() => {
    const imageFile = form.getValues("image");
    if (imageFile[0]) {
      // Generate preview URL for the uploaded image
      const previewUrl = URL.createObjectURL(imageFile[0]);
      setImagePreview(previewUrl);

      // Clean up the preview URL when the component unmounts or when the file changes
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    } else {
      setImagePreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const onSubmit = async (data: userSchema.IuserSchema) => {
    try {
      setIsLoading(true);

      const requestBody: any = {
        userID: session.data?.user.id,
        ...data,
      };

      // Check if a new image is uploaded
      if (data.image && data.image.length > 0) {
        const reader = new FileReader();

        const base64Image = await new Promise<string | ArrayBuffer | null>(
          (resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(data.image[0]);
          },
        );

        requestBody.base64Image = base64Image;
      }

      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      // Check for success
      if (response.ok) {
        toast.success(
          responseData.message || "User profile successfully updated!",
        );

        if (session.data?.user.id) {
          logActivity(
            session.data?.user.firstName +
              " " +
              session?.data?.user?.lastName || "",
            "updated their profile information",
          );
          const exisitingImage = user?.image;
          if (session.data.user.email != data.email) {
            setTimeout(() => {
              void signOut();
            }, 1500);
          }
          setUser({
            id: session?.data?.user.id,
            image: responseData.user.image ?? exisitingImage,
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            email: data.email,
            department: data.department,
          });
        }
      } else {
        toast.error(responseData?.message || "Something went wrong");
        console.error("Something went wrong");
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the user profile.");
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full bg-custom-gray p-5 shadow-lg drop-shadow-md sm:p-10 lg:w-4/5 lg:px-24">
          <p className="text-2xl font-semibold text-gray-dark">
            Profile Settings
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-10">
                <img
                  src={
                    imagePreview
                      ? imagePreview
                      : user?.image
                        ? user?.image
                        : avatar.src
                  }
                  alt="Avatar"
                  className="rounded-full"
                  height={120}
                  width={120}
                />
                <div className="w-full md:w-fit">
                  <div className="mb-2 flex gap-3">
                    <Label>Profile image</Label>
                    <TooltipInformation>
                      <p>
                        Note: Only .jpeg, .jpg and .png <br/>images are accepted{" "}
                      </p>
                    </TooltipInformation>
                  </div>
                  <Input id="image" type="file" {...form.register("image")} />
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormInput form={form} name="firstName" label="First Name" />
                <FormInput form={form} name="middleName" label="Middle Name" />
                <FormInput form={form} name="lastName" label="Last Name" />
                <FormCombobox
                  label="Department"
                  form={form}
                  placeholder="Select Department"
                  name={"department"}
                  data={departmentList1}
                  disabled={session?.data?.user.role === "Security Guard" || session?.data?.user.role === "Super Admin"}
                />
                <FormInput form={form} name="email" label="Email" />
              </div>
              <Button className="ml-auto mt-6 block items-center bg-green-light px-10 font-bold hover:bg-primary-green">
                {isLoading ? "UPDATING..." : "UPDATE"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Container>
  );
}
