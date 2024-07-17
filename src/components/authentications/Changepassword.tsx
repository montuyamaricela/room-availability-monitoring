import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function Changepassword() {
  return (
    <Container className="h-screen bg-primary-green">
      <div className="flex justify-center items-center ">
        <div className="flex rounded-lg shadow-lg md:w-3/4 w-4/4">
          <div className="bg-gradient-to-b from-green-400 to-green-800 drop-shadow-md rounded-l-2xl w-1/2 lg:p-14 p-10 md:block hidden">
            <Image src={logo} alt="BulSULogo" width={150}/>
            <p className="text-white font-bold lg:text-4xl text-3xl mt-16">CHANGE PASSWORD</p>
            <p className="text-white font-500 text-xs mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="bg-white rounded-r-2xl w-1/2 md:block hidden">
            <div className="lg:p-16 md:pt-14 p-10">
              <form>
                <Label htmlFor="current" className="text-gray-dark">Current Password</Label>
                <Input type="password" id="current" placeholder="Current Password" className="mb-7"/>

                <Label htmlFor="new" className="text-gray-dark">New Password</Label>
                <Input type="password" id="new" placeholder="New Password" className="mb-7"/>

                <Label htmlFor="confirm" className="text-gray-dark">Confirm Password</Label>
                <Input type="password" id="confirm" placeholder="Confirm Password" className="mb-5"/>

                <div className="flex justify-center pt-5">
                  <Button className="bg-green-dark font-bold w-2/6 hover:bg-green-900 items-center">CHANGE</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:mt-2 mt-5  md:w-full block md:hidden">
            <div className="p-11">
                <form>
                    <Label htmlFor="current" className="text-gray-dark">Current Password</Label>
                    <Input type="password" id="current" placeholder="Current Password" className="mb-7"/>

                    <Label htmlFor="new" className="text-gray-dark">New Password</Label>
                    <Input type="password" id="new" placeholder="New Password" className="mb-7"/>

                    <Label htmlFor="confirm" className="text-gray-dark">Confirm Password</Label>
                    <Input type="password" id="confirm" placeholder="Confirm Password" className="mb-5"/>

                    <div className="flex justify-center pt-5">
                        <Button className="bg-green-dark font-bold w-2/6 hover:bg-green-900 pl-10 pr-10 items-center">CHANGE</Button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-10 text-white text-sm md:mt-7 sm:mt-14 mt-24">
        <Link href="#">Terms of Service</Link>
        <Link href="#">Privacy Policy</Link>
      </div>
    </Container>
  );
}