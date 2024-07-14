import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Signup() {
  return (
    <Container className="h-screen bg-primary-green">
      <div className="flex justify-center items-center ">
        <div className="flex rounded-lg shadow-lg md:w-3/4 w-4/4">
          <div className="bg-gradient-to-b from-green-400 to-green-800 drop-shadow-md rounded-l-2xl w-1/2 p-16 md:block hidden">
            <Image src={logo} alt="BulSULogo" width={150} className="mt-5"/>
            <p className="text-white font-bold text-4xl mt-20">CREATE ACCOUNT</p>
            <p className="text-white font-500 text-xs mt-7">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="bg-white rounded-r-2xl w-1/2 md:block hidden">
            <div className="lg:p-10">
              <form>

                <div className="flex justify-center mb-4 gap-5">
                  <div>
                    <Label htmlFor="id" className="text-gray-dark">ID</Label>
                    <Input type="text" id="id" placeholder="ID"/>
                  </div>
                  <div>
                    <Label className="text-gray-dark">Role</Label>
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="guard">Security Guard</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-dark">Department</Label>
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Department</SelectLabel>
                          <SelectItem value="cba">CBA</SelectItem>
                          <SelectItem value="cics">CICS</SelectItem>
                          <SelectItem value="coed">CoED</SelectItem>
                          <SelectItem value="cit">CIT</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center mb-4 gap-5">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-dark">First Name</Label>
                    <Input type="text" id="firstName" placeholder="First Name"/>
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-dark">Last Name</Label>
                    <Input type="text" id="lastName" placeholder="Last Name"/>
                  </div>
                </div>

                <Label htmlFor="email" className="text-gray-dark">Email</Label>
                <Input type="email" id="email" placeholder="Email" className="mb-4"/>

                <Label htmlFor="password" className="text-gray-dark">Password</Label>
                <Input type="password" id="password" placeholder="Password" className="mb-4"/>

                <Label htmlFor="confirmPassword" className="text-gray-dark">Confirm Password</Label>
                <Input type="password" id="confirmPassword" placeholder="Confirm Password" className="mb-2"/>

                <h3 className="text-gray-dark font-medium mb-10 text-xs">
                By clicking Sign Up, you agree to our 
                <Link href="#" className="text-green-dark font-semibold"> Terms of Service </Link><br></br>
                and that you have read our  
                <Link href="#" className="text-green-dark font-semibold"> Privacy Policy</Link>
                </h3>
                <div className="flex justify-center">
                  <Button className="bg-green-dark font-bold w-2/6 hover:bg-green-900 items-center">CREATE</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-10 text-white text-sm md:mt-7 mt-14">
        <Link href="#">Terms of Service</Link>
        <Link href="#">Privacy Policy</Link>
      </div>
    </Container>
  );
}
