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

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  children: ReactNode;
};

const RoomModalAdmin = ({ ButtonTrigger, children }: ModalWrapperTypes) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="md:max-w-[65%] max-h-[90%] max-w-[90%] overflow-y-scroll">
        <Tabs defaultValue="room">
            <DialogHeader className="rounded-t-2xl">
            <DialogTitle>
                <TabsList className="rounded-t-2xl border border-2 border-primary-green w-full mb-4">
                    <TabsTrigger value="assign" className="rounded-tl-xl w-full h-full text-base">ROOM ASSIGNMENT</TabsTrigger>
                    <TabsTrigger value="details" className="rounded-tr-xl h-full w-full text-base">ROOM DETAILS</TabsTrigger>
                </TabsList>
            </DialogTitle>
            </DialogHeader>
            {children}
            <TabsContent value="assign" className="p-5">
               <form>
                <div className="grid grid-cols-3 md:gap-6 gap-4 mb-5">
                  <div>
                    <Label htmlFor="facultyName">Faculty Name</Label>
                    <Input type="text" id="facultyName" placeholder="Faculty Name" required/>
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
                <Button className="bg-green-light hover:bg-primary-green">+ Add</Button>
                <Button className="bg-green-light hover:bg-primary-green ml-2">Update</Button>
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
                                <Button className="bg-transparent hover:bg-red-light hover:no-underline hover:text-white text-red-light underline">
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
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <Label htmlFor="lecture">Lecture</Label>
                    <Input type="checkbox" id="lecture" className="h-4"/>

                    <Label htmlFor="lab">Laboratory</Label>
                    <Input type="checkbox" id="lab" className="h-4"/>

                    <Label htmlFor="aircon">Airconditioned</Label>
                    <Input type="checkbox" id="aircon" className="h-4"/>

                    <Label htmlFor="tv">With TV</Label>
                    <Input type="checkbox" id="tv" className="h-4"/>

                    <Label htmlFor="capacity">Capacity:</Label>
                    <Input type="number" id="capacity" className="h-8"/>

                    <Label htmlFor="eFan">Electric Fan: </Label>
                    <Input type="number" id="eFan" className="h-8"/>

                    <Label htmlFor="availableCom">Available Computers: </Label>
                    <Input type="number" id="availableCom" className="h-8"/>

                    <Label htmlFor="functional">Functional: </Label>
                    <Input type="number" id="functional" className="h-8"/>

                    <Label htmlFor="nonFunctional">Non-functional: </Label>
                    <Input type="number" id="nonFunctional" className="h-8"/>
                  </div>
                </div>
                <div className="flex justify-center my-6">
                  <div>
                    <Button className="bg-green-light hover:bg-primary-green px-10">Save</Button>
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