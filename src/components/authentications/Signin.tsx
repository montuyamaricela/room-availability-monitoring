import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function Signin() {
  return (
    <Container className="h-screen bg-primary-green">
      <div className="flex justify-center items-center ">
        <div className="flex rounded-lg shadow-lg md:w-3/4 w-4/4">
          <div className="bg-gradient-to-b from-green-400 to-green-800 drop-shadow-md rounded-l-2xl w-1/2 p-16 md:block hidden">
            <Image src={logo} alt="BulSULogo" width={150}/>
            <p className="text-white font-bold text-4xl mt-16">LOGIN</p>
            <p className="text-white font-500 text-xs mt-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="bg-white rounded-r-2xl w-1/2 md:block hidden">
            <div className="lg:p-20 md:pt-32 md:pb-20 p-10 ">
              <form>
                <Label htmlFor="email" className="text-gray-dark">Email</Label>
                <Input type="email" id="email" placeholder="Email" className="mb-7"/>

                <Label htmlFor="password" className="text-gray-dark">Password</Label>
                <Input type="password" id="password" placeholder="Password" className="mb-5"/>

                <h3 className="text-gray-dark font-medium text-right mb-10 text-sm">
                  Forgot password? 
                  <Link href="#" className="text-green-dark underline"> Click here</Link>
                </h3>
                <div className="flex justify-center pt-5">
                  <Button className="bg-green-dark font-bold w-2/6 hover:bg-green-900 items-center">LOGIN</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-2xl md:w-full block md:hidden">
            <div className="p-20">
              <form>
                <Label htmlFor="email" className="text-gray-dark">Email</Label>
                <Input type="email" id="email" placeholder="Email" className="mb-7"/>

                <Label htmlFor="password" className="text-gray-dark">Password</Label>
                <Input type="password" id="password" placeholder="Password" className="mb-5"/>

                <h3 className="text-gray-dark font-medium text-right mb-10">
                  Forgot password? 
                  <Link href="#" className="text-green-dark underline"> Click here</Link>
                </h3>
                <div className="flex justify-center pt-5">
                  <Button className="bg-green-dark font-bold w-2/6 hover:bg-green-900 items-center">LOGIN</Button>
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