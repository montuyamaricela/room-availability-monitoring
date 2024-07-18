import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import Image from "next/image";
import icon from "/public/images/icon/add.png";
import SelectDepartment from "../common/SelectDepartment";
import { exit } from "process";

export default function ComposeFeedBack() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image src={icon} alt="Add" width={20} className="cursor-pointer"/>
      </DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader>
            <div className="flex justify-center mb-4">
                <DialogTitle>COMPOSE FEEDBACK</DialogTitle>
            </div>
        </DialogHeader>
        <div>
            <div className="w-1/3">
                <Label className="text-gray-dark text-md font-bold">
                    To: 
                    <p className="font-medium text-sm my-1">Department</p>
                </Label>
                <SelectDepartment />
            </div>
            <div className="mt-5">
                <Textarea />
            </div>
        </div>
        <DialogFooter>
          <Button className="md:mt-0 mt-2">CANCEL</Button>
          <Button type="submit" className="bg-green-dark hover:bg-green-light">SUBMIT</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
