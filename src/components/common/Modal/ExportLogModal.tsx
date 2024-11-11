/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { FormCombobox } from "~/components/ui/form-components";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import * as exportSchema from "../../../validations/logExportSchema";
import { Form } from "~/components/ui/form";
import { DatePickerWithRange } from "~/components/ui/date-range";
import { type DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Label } from "~/components/ui/label";
import ExportRoomLogs from "../Table/ExportRoomLogs";
import { type roomLogsAttributes } from "~/data/models/auditLogs";
import { Parser } from "@json2csv/plainjs";
import toast from "react-hot-toast";

type ExportLogModalTypes = {
  ButtonTrigger: ReactNode;
  faculties: {
    label: string;
    value: string;
  }[];
  roomIds: {
    label: string;
    value: string;
  }[];
};

const ExportLogModal = ({
  ButtonTrigger,
  faculties,
  roomIds,
}: ExportLogModalTypes) => {
  const [roomLogs, setRoomLogs] = useState<roomLogsAttributes[]>([]);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: exportSchema.logExportResolver,
    defaultValues: exportSchema.LogExportDefaultValues,
  });
  const onSubmit = async (data: exportSchema.ILogExport) => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-logs", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const responseData = await response.json();
      setRoomLogs(responseData.data);
      if (response.ok) {
        if (responseData.data.length === 0) {
          toast.error("No Data Found");
        }
        setRoomLogs(responseData.data);
      } else {
        toast.error(responseData?.error || "Something went wrong");
        console.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching room logs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (date?.from) {
      form.setValue("startDate", format(date.from, "yyyy-MM-dd"));
    }

    if (date?.to) {
      form.setValue("endDate", format(date.to, "yyyy-MM-dd"));
    }
  }, [date, form]);

  const exportToCSV = () => {
    const fields = [
      { label: "ID", value: "id" },
      { label: "Room ID", value: "roomId" },
      { label: "Activity", value: "activity" },
      { label: "Borrowed At", value: "formattedBorrowedAt" },
      { label: "Returned At", value: "formattedReturnedAt" },
      { label: "Date", value: "formattedDate" },
    ];

    const formattedRoomLogs = roomLogs.map((log) => ({
      ...log,
      formattedBorrowedAt: log.borrowedAt
        ? format(new Date(log.borrowedAt), "h:mm a")
        : "",
      formattedReturnedAt: log.returnedAt
        ? format(new Date(log.returnedAt), "h:mm a")
        : "",
      formattedDate: log.borrowedAt
        ? format(new Date(log.borrowedAt), "MMM dd, yyyy")
        : "",
    }));

    const parser = new Parser({ fields });
    const csvData = parser.parse(formattedRoomLogs); // Convert formatted data to CSV

    // Format start and end dates for the filename
    const formattedStartDate = date?.from
      ? format(new Date(date.from), "yyyy-MM-dd")
      : "all";
    const formattedEndDate = date?.to
      ? format(new Date(date.to), "yyyy-MM-dd")
      : "all";

    // Create a blob and download the CSV
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `room-logs report(${formattedStartDate} - ${formattedEndDate}).csv`;
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className=" max-w-[95%] md:max-w-[70%]">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-5">
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Export Room Logs
          </DialogTitle>
        </DialogHeader>

        <div className="px-10 pb-10 pt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-5 grid grid-cols-2 items-end gap-4 md:gap-4">
                <FormCombobox
                  label="Faculty Name"
                  form={form}
                  placeholder="Select Faculty"
                  name={"facultyName"}
                  data={faculties}
                />
                <FormCombobox
                  label="Room Name/ID"
                  form={form}
                  placeholder="Select Room"
                  name={"roomID"}
                  data={roomIds}
                />
                <div className="space-y-1">
                  <Label>Start Date & End Date</Label>
                  <DatePickerWithRange date={date} setDate={setDate} />
                </div>
              </div>
              <Button className="col-span-2 mx-auto w-44 bg-primary-green hover:bg-primary-green">
                {loading ? "Exporting..." : "Export"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="mx-10 mb-10 flex h-[50vh] flex-col items-end">
          <div className="w-full">
            <ExportRoomLogs loading={loading} roomLogs={roomLogs} />
          </div>
          {roomLogs && (
            <Button
              onClick={exportToCSV}
              disabled={loading}
              className="ml-auto mt-5 w-44 bg-primary-green hover:bg-primary-green"
            >
              Download as csv
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportLogModal;
