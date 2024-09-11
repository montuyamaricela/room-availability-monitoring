import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import RoomLogsForm from "../forms/RoomLogsForm";
import * as scheduleSchema from "../../validations/ScheduleSchema";
import { api } from "~/trpc/react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sched } from "../../app/SampleData";
import FormattingTable, { type TableColumn } from "../common/Table/Table";
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
import { useForm } from "react-hook-form";

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
  const form = useForm({
    resolver: scheduleSchema.ScheduleSchemaResolver,
    defaultValues: scheduleSchema.ScheduleSchemaDefaultValues,
  });

  const { data, isLoading, error, refetch } = api.user.getAllUser.useQuery();
  console.log(data);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className=" max-w-3xl">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-3">
          <DialogTitle className="text-center text-2xl font-medium uppercase text-white">
            Log
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll  p-5">
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
