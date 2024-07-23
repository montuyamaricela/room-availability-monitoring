import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Time from "../common/Time";
import { sched } from "../../app/SampleData";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const getCurrentDayOfWeek = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date().getDay();
    return daysOfWeek[dayIndex];
  };

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  children: ReactNode;
};

const RoomModalSecurity = ({ ButtonTrigger, children }: ModalWrapperTypes) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="md:max-w-[65%] max-h-[90%] max-w-[90%] overflow-y-scroll">
            <DialogHeader className="rounded-t-2xl bg-primary-green py-3">
            <DialogTitle className="text-center text-2xl font-medium uppercase text-white">
                Log
            </DialogTitle>
            </DialogHeader>
            {children}
            <div className="p-5">
                <form>
                    <div className="grid grid-cols-3 md:gap-6 gap-4 mb-5">
                        <div>
                            <Label htmlFor="facultyName">Faculty Name</Label>
                            <Select required>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Faculty Name</SelectLabel>
                                        <SelectItem value="ma">Marc Alfaro</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="courseCode">Course Code</Label>
                            <Input type="text" id="courseCode" placeholder="Course Code"/>
                        </div>
                        <div>
                            <Label htmlFor="section">Section</Label>
                            <Input type="text" id="section" placeholder="Section"/>
                        </div>
                        <div>
                            <Label htmlFor="day">Day</Label>
                            <Input type="text" id="day" value={getCurrentDayOfWeek()} disabled/>
                        </div>
                        <div>
                            <Label>From</Label>
                            <Time />
                        </div>
                        <div>
                            <Label>To</Label>
                            <Time />
                        </div>
                    </div>
                    <Button className="bg-green-light hover:bg-primary-green">+ Add</Button>
                </form>
               <Input type="text" id="search" placeholder="Search" className="float-right my-3 lg:w-2/4 w-1/2"/>
               <Table className="border border-2">
                    <TableHeader>
                        <TableRow className="border-t">
                            <TableHead>Faculty Name</TableHead>
                            <TableHead>Course Code</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Begin Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Day</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sched.map((details) => (
                        <TableRow key={details.id} className="border border-2 odd:bg-table-gray">
                            <TableCell>{details.name}</TableCell>
                            <TableCell>{details.couseCode}</TableCell>
                            <TableCell>{details.section}</TableCell>
                            <TableCell>{details.beginTime}</TableCell>
                            <TableCell>{details.endTime}</TableCell>
                            <TableCell>{details.day}</TableCell>
                            <TableCell>
                                <Button className="bg-green-light rounded-3xl px-5 mb-2">
                                    Time in
                                </Button>
                                <Button className="bg-gray-light rounded-3xl">
                                    Time out
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                  </Table>
            </div>
            
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalSecurity;