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
      <div className="flex justify-center items-center">
        <div className="bg-custom-gray shadow-lg drop-shadow-md lg:w-4/5 w-full lg:px-24 px-14 py-10">
            <p className="text-gray-dark font-semibold text-2xl">Profile Settings</p>
            <div className="flex flex-col md:flex-row justify-center items-center md:gap-10 gap-3 mt-6">
                <Image src={avatar} alt="Avatar" width={120}/>
                <div>
                    <Label>Change Profile Picture</Label>
                    <Input id="picture" type="file"/>
                </div>
                <div className="flex gap-2 items-center">
                    <Image src={icon} alt="Information" width={20} />
                    <p className="text-green-light text-xs">Note! Only .jpeg, .jpg and .png images are accepted </p>
                </div>
            </div>
            <form>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-6">
                <div>
                    <Label htmlFor="lastName" className="text-gray-dark text-semibold">Last Name</Label>
                    <Input type="text" id="lastName" required/>
                </div>
                <div>
                    <Label htmlFor="firstName" className="text-gray-dark text-semibold">First Name</Label>
                    <Input type="text" id="firstName" required/>
                </div>
                <div>
                    <Label htmlFor="middleName" className="text-gray-dark text-semibold">Middle Name</Label>
                    <Input type="text" id="middleName" required/>
                </div>
                <div>
                    <Label htmlFor="department" className="text-gray-dark text-semibold">Department</Label>
                    <SelectDepartment />
                </div>
                <div>
                    <Label htmlFor="email" className="text-gray-dark text-semibold">Email</Label>
                    <Input type="email" id="email" required/>
                </div>
              </div>
              <Button className="bg-green-light font-bold hover:bg-green-900 lg:float-right items-center mt-6 mx-auto block">UPDATE</Button>  
            </form>
        </div>
      </div>
    </Container>
  );
}