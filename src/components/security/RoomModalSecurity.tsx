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
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = new Date().getDay();
  return daysOfWeek[dayIndex];
};

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const RoomModalSecurity = ({
  ButtonTrigger,
  open,
  setOpen,
}: ModalWrapperTypes) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90%] max-w-[92%] overflow-y-scroll lg:max-w-[65%]">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-3">
          <DialogTitle className="text-center text-2xl font-medium uppercase text-white">
            Log
          </DialogTitle>
        </DialogHeader>
        <div className="p-5">
          <form>
            <div className="mb-5 grid grid-cols-3 gap-4 md:gap-6">
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
                <Input type="text" id="courseCode" placeholder="Course Code" />
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Input type="text" id="section" placeholder="Section" />
              </div>
              <div>
                <Label htmlFor="day">Day</Label>
                <Input
                  type="text"
                  id="day"
                  value={getCurrentDayOfWeek()}
                  disabled
                />
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
            <Button className="bg-green-light hover:bg-primary-green">
              + Add
            </Button>
          </form>
          <Input
            type="text"
            id="search"
            placeholder="Search"
            className="float-right my-3 w-1/2 lg:w-2/4"
          />
          <Table className="border-2">
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
                <TableRow
                  key={details.id}
                  className="border border-2 odd:bg-table-gray"
                >
                  <TableCell>{details.name}</TableCell>
                  <TableCell>{details.couseCode}</TableCell>
                  <TableCell>{details.section}</TableCell>
                  <TableCell>{details.beginTime}</TableCell>
                  <TableCell>{details.endTime}</TableCell>
                  <TableCell>{details.day}</TableCell>
                  <TableCell>
                    <Button className="mb-2 rounded-3xl bg-green-light px-5">
                      Time in
                    </Button>
                    <Button className="rounded-3xl bg-gray-light">
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
