import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import RoomAssignmentForm from "../forms/RoomAssignmentForm";
import FormattingTable, { type TableColumn } from "../common/FormattingTable";
import RoomDetailsForm from "../forms/RoomDetailsForm";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
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
import { useState } from "react";

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

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  // const [smsLogs, setSmsLogs] = useState<PaginatedList<smsLogs>>(initialPaginatedList);

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
            <p className="text-center text-xl font-semibold mb-5"> Room {selectedRoom?.roomName}</p>
            
            <RoomAssignmentForm />

            <Input
              type="text"
              id="search"
              placeholder="Search"
              className="float-right my-3 w-1/2 lg:w-2/4"
            />

            {/* <FormattingTable<smsLogs>
              loading={loading}
              columns={columns}
              records={smsLogs.data}
              pagination={smsLogs.meta.pagination}
              onChangePage={(page) => setPage(page)}
            /> */}
          </TabsContent>

          <TabsContent value="details" className="p-5">
            <p className="text-center text-xl font-semibold mb-5"> Room {selectedRoom?.roomName}</p>
            <RoomDetailsForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalAdmin;

// export const columns: TableColumn<smsLogs>[] = [
//     {
//       id: "facultyName",
//       header: "Faculty Name",
//       formatter: (row) => <span>{row.attributes.facultyName}</span>,
//     },
//     {
//       id: "courseCode",
//       header: "Course Code",
//       formatter: (row) => <span>{row.attributes.courseCode}</span>,
//     },
//     {
//       id: "section",
//       header: "Section",
//       formatter: (row) => <span>{row.attributes.section}</span>,
//     },
//     {
//       id: "beginTime",
//       header: "Begin Time",
//       formatter: (row) => <span>{row.attributes.beginTime}</span>,
//     },
//     {
//       id: "endTime",
//       header: "End Time",
//       formatter: (row) => <span>{row.attributes.endTime}</span>,
//     },
//     {
//       id: "day",
//       header: "Day",
//       formatter: (row) => <span>{row.attributes.section}</span>,
//     },
//     {
//       id: "action",
//       header: "Action",
//       formatter: (row) => <span>{row.attributes.action}</span>,
//     },
//   ];