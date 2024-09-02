"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { FormCombobox} from "../ui/form-components";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { roomHeader } from "../../app/SampleData";
import { roomDetails } from "../../app/SampleData";
import { useForm } from "react-hook-form";

export default function FileUploader() {
    return (
        <Container>
        <div className="flex items-center justify-center">
            <div className="w-full min-w-[367px] rounded border border-gray-light p-8 shadow-md drop-shadow-md">
            <h1 className="text-2xl font-semibold text-gray-dark">
                FILE MANAGEMENT
            </h1>
            <hr className="mt-1 mb-7 border border-gray-light border-t-1"/>
            {/* Nagtry ako gayahin sa ginagawa mo sa form kaya may ganyan hehehe  */}
            {/* <Form {...form}> */}
                <form>
                    <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
                        <div className="flex flex-row gap-5">
                            <div className="w-[50%]">
                                <h1 className="text-lg font-semibold text-gray-dark">
                                    File Category
                                </h1>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Faculty">Faculty</SelectItem>
                                        <SelectItem value="Room">Room</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-[50%]">
                                <h1 className="text-lg font-semibold text-gray-dark">
                                    File Attachment
                                </h1>
                                <Input id="files" type="file" className="w-[100%]"/>
                            </div>
                        </div>
                        <Input
                            type="text"
                            id="search"
                            placeholder="Search"
                            required
                            className="float-right my-5 w-full md:w-1/3"
                            // value={search}
                            // onChange={(e) => setSearch(e.target.value)}
                        />
                    
                    </div>
                    <div className="mt-8">
                        <h1 className="text-lg font-semibold text-green-light">
                        File Content
                        </h1>
                        <div className="max-h-[300px] overflow-y-auto">
                            <Table>
                            <TableHeader>
                              <TableRow>
                                {roomHeader.map((roomHeader) => (
                                    <TableHead key={roomHeader.id}>
                                        {roomHeader.headers}
                                    </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roomDetails.map((details) => (
                                <TableRow key={details.id}>
                                    <TableCell>{details.roomName}</TableCell>
                                    <TableCell>{details.building}</TableCell>
                                    <TableCell>{details.floor}</TableCell>
                                    <TableCell>{details.WithTv}</TableCell>
                                    <TableCell>{details.isLecture}</TableCell>
                                    <TableCell>{details.isLaboratory}</TableCell>
                                    <TableCell>{details.isAirconed}</TableCell>
                                    <TableCell>{details.capacity}</TableCell>
                                    <TableCell>{details.electricFans}</TableCell>
                                    <TableCell>{details.functioningComputers}</TableCell>
                                    <TableCell>{details.notFunctioningComputers}</TableCell>
                                    <TableCell>{details.status}</TableCell>
                                    <TableCell>{details.disable}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5">
                    <Button className="px-10 items-center bg-green-light hover:bg-green-900">
                    SUBMIT
                    </Button>
                  </div>
                </form>
            {/* </Form> */}
            </div>
        </div>
        </Container>
    );
}

export const category = [
    { label: "Faculty", value: "Faculty" },
    { label: "Room", value: "Room" },
];