"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import avatar from "/public/images/avatar/image.png";
import icon from "/public/images/icon/image.png";
import SelectDepartment from "../common/SelectDepartment";

export default function ProfileSettings() {
  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-4/5 bg-custom-gray px-14 py-10 shadow-lg drop-shadow-md md:px-24">
          <p className="text-2xl font-semibold text-gray-dark">
            Profile Settings
          </p>
          <div className="mt-6 items-center justify-center gap-10 lg:flex">
            <Image src={avatar} alt="Avatar" width={120} />
            <div className="w-full items-center lg:w-1/3">
              <Label>Change Profile Picture</Label>
              <Input id="picture" type="file" className="mt-2" />
            </div>
            <div className="mt-2 flex items-center gap-2 lg:mt-0">
              <Image src={icon} alt="Information" width={20} />
              <p className="text-xs text-green-light">
                Note! Only .jpeg, .jpg and .png images are accepted{" "}
              </p>
            </div>
          </div>
          <form>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <Input type="text" id="firstName" required />
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
