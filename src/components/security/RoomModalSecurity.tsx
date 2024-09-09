import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import RoomLogsForm from "../forms/RoomLogsForm";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sched } from "../../app/SampleData";
import FormattingTable, { type TableColumn } from "../common/FormattingTable";
// import { columns } from "../admin/RoomModalAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  // const [smsLogs, setSmsLogs] = useState<PaginatedList<smsLogs>>(initialPaginatedList);

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
          <RoomLogsForm />
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalSecurity;