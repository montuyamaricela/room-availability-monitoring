"use client";
import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import avatar from "/public/images/avatar/image.png";
import icon from "/public/images/icon/image.png";
import SelectDepartment from "../common/SelectDepartment";
import { useSession } from "next-auth/react";

export default function ProfileSettings() {
  const session = useSession();
  console.log(session);
  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full bg-custom-gray px-14 py-10 shadow-lg drop-shadow-md lg:w-4/5 lg:px-24">
          <p className="text-2xl font-semibold text-gray-dark">
            Profile Settings
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-10">
            <Image src={avatar} alt="Avatar" width={120} />
            <div>
              <Label>Change Profile Picture</Label>
              <Input id="picture" type="file" />
            </div>
            <div className="flex items-center gap-2">
              <Image src={icon} alt="Information" width={20} />
              <p className="text-xs text-green-light">
                Note! Only .jpeg, .jpg and .png images are accepted{" "}
              </p>
            </div>
          </div>
          <form>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-semibold text-gray-dark"
                >
                  Last Name
                </Label>
                <Input type="text" id="lastName" required />
              </div>
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-semibold text-gray-dark"
                >
                  First Name
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  value={session?.data?.user.name}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="middleName"
                  className="text-semibold text-gray-dark"
                >
                  Middle Name
                </Label>
                <Input type="text" id="middleName" required />
              </div>
              <div>
                <Label
                  htmlFor="department"
                  className="text-semibold text-gray-dark"
                >
                  Department
                </Label>
                <SelectDepartment />
              </div>
              <div>
                <Label htmlFor="email" className="text-semibold text-gray-dark">
                  Email
                </Label>
                <Input type="email" id="email" required />
              </div>
            </div>
            <Button className="mx-auto mt-6 block items-center bg-green-light font-bold hover:bg-green-900 lg:float-right">
              UPDATE
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
