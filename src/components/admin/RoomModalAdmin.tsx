import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Day from "../common/Day";
import Time from "../common/Time";
import { sched } from "../../app/SampleData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRoomStore } from "~/store/useRoomStore";

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const RoomModalAdmin = ({
  ButtonTrigger,
  open,
  setOpen,
}: ModalWrapperTypes) => {
  const { selectedRoom } = useRoomStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90%] max-w-[92%] lg:max-w-[65%]">
        <Tabs defaultValue="room">
          <DialogHeader className="rounded-t-2xl">
            <DialogTitle>
              <TabsList className="mb-4 w-full rounded-t-2xl border-2 border-primary-green">
                <TabsTrigger
                  value="assign"
                  className="h-full w-full rounded-tl-xl text-base"
                >
                  ROOM ASSIGNMENT
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="h-full w-full rounded-tr-xl text-base"
                >
                  ROOM DETAILS
                </TabsTrigger>
              </TabsList>
            </DialogTitle>
          </DialogHeader>
          <TabsContent value="assign" className="p-5">
            <form>
              <div className="mb-5 grid grid-cols-3 gap-4 md:gap-6">
                <div>
                  <Label htmlFor="facultyName">Faculty Name</Label>
                  <Input
                    type="text"
                    id="facultyName"
                    placeholder="Faculty Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    type="text"
                    id="courseCode"
                    placeholder="Course Code"
                  />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input type="text" id="section" placeholder="Section" />
                </div>
                <div>
                  <Label>Day</Label>
                  <Day />
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
              <Button className="ml-2 bg-green-light hover:bg-primary-green">
                Update
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
                      <Button className="bg-transparent text-red-light underline hover:bg-red-light hover:text-white hover:no-underline">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="details" className="p-5">
            <form>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="disable ">Disable Room</Label>
                  <Input
                    type="checkbox"
                    id="disable"
                    checked={selectedRoom?.disable ? true : false}
                    className="h-4"
                  />

                  <Label htmlFor="lecture">Lecture</Label>
                  <Input
                    type="checkbox"
                    id="lecture"
                    checked={selectedRoom?.isLecture ? true : false}
                    className="h-4"
                  />

                  <Label htmlFor="lab">Laboratory</Label>
                  <Input
                    type="checkbox"
                    id="lab"
                    checked={selectedRoom?.isLecture ? true : false}
                    className="h-4"
                  />

                  <Label htmlFor="aircon">Airconditioned</Label>
                  <Input
                    type="checkbox"
                    id="aircon"
                    checked={selectedRoom?.isAirconed ? true : false}
                    className="h-4"
                  />

                  <Label htmlFor="tv">With TV</Label>
                  <Input
                    type="checkbox"
                    id="tv"
                    checked={selectedRoom?.withTv ? true : false}
                    className="h-4"
                  />

                  <Label htmlFor="capacity">Capacity:</Label>
                  <Input
                    type="number"
                    id="capacity"
                    value={selectedRoom?.capacity}
                    className="h-8"
                  />

                  <Label htmlFor="eFan">Electric Fan: </Label>
                  <Input
                    type="number"
                    id="eFan"
                    value={selectedRoom?.electricFans}
                    className="h-8"
                  />

                  <Label htmlFor="availableCom">Available Computers: </Label>
                  <Input
                    type="number"
                    id="availableCom"
                    value={
                      selectedRoom?.notFunctioningComputers &&
                      selectedRoom?.notFunctioningComputers +
                        selectedRoom?.functioningComputers
                    }
                    className="h-8"
                  />

                  <Label htmlFor="functional">Functioning: </Label>
                  <Input
                    type="number"
                    id="functional"
                    value={selectedRoom?.functioningComputers}
                    className="h-8"
                  />

                  <Label htmlFor="nonFunctional">Non-functioning: </Label>
                  <Input
                    type="number"
                    id="nonFunctional"
                    value={selectedRoom?.functioningComputers}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="my-6 flex justify-center">
                <div>
                  <Button className="bg-green-light px-10 hover:bg-primary-green">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalAdmin;
