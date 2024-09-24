import React, { useEffect, useState } from "react";
import { type scheduleAttributes } from "~/data/models/schedule";
import Table, { type TableColumn } from "../common/Table/Table";
import { api } from "~/trpc/react";
import { useRoomStore } from "~/store/useRoomStore";
import { addHours, format, isPast, parse, subHours } from "date-fns";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { formatTimetoLocal } from "~/lib/timeSchedule";
import TimeInConfirmation from "../common/Modal/TimeInConfirmation";
import roomTimeOut from "~/hooks/roomTimeOut";
import TimeoutConfirmation from "../common/Modal/TimeoutConfirmation";

export default function ScheduleTable({
  isSubmitted,
  setSubmitted,
}: {
  isSubmitted: boolean;
  setSubmitted: (submitted: boolean) => void;
}) {
  const { rooms, selectedRoom } = useRoomStore();
  const currentDate = new Date();

  // Time in confirmation modal state
  const [open, setOpen] = useState<boolean>(false);

  const { mutate, isPending, data, error } =
    api.schedule.getRoomSchedule.useMutation({
      onSuccess: (data) => {
        setRoomSchedule(data);
        setSubmitted(false);
      },
      onError: (error) => {
        console.error("Failed to fetch schedule:", error);
        toast.error(error.message);
      },
    });

  const [roomSchedule, setRoomSchedule] = useState<scheduleAttributes[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  // Calculate total pages
  const totalRecords = roomSchedule.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = roomSchedule.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const [selectedSchedule, setSelectedSchedule] =
    useState<scheduleAttributes>();

  useEffect(() => {
    mutate({
      room: selectedRoom?.id ?? "",
      day: format(currentDate, "EEEE"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);
  const columns: TableColumn<scheduleAttributes>[] = [
    {
      id: "facultyName",
      header: "Faculty Name",
      width: 100,
      formatter: (row) => <span>{row?.facultyName}</span>,
    },
    {
      id: "section",
      header: "Section",
      width: 100,
      formatter: (row) => <span>{row?.section}</span>,
    },
    {
      id: "Subject",
      header: "Subject",
      width: 100,
      formatter: (row) => <span>{row?.courseCode}</span>,
    },
    {
      id: "Begin Time",
      header: "Begin Time",
      width: 100,
      formatter: (row) => <span>{formatTimetoLocal(row.beginTime)}</span>,
    },
    {
      id: "End Time",
      header: "End Time",
      width: 100,
      formatter: (row) => <span>{formatTimetoLocal(row.endTime)}</span>,
    },
    {
      id: "Action",
      header: "Action",
      formatter: (row) => (
        <span className="flex justify-start gap-2">
          {/* disable the button if time is past end time  */}
          <Button
            disabled={
              isPast(
                subHours(
                  parse(
                    formatTimetoLocal(new Date(row.endTime)),
                    "h:mm a",
                    new Date(),
                  ),
                  1,
                ),
              ) || selectedRoom?.status === "OCCUPIED"
            }
            onClick={() => {
              setSelectedSchedule(row);
              setOpen(true);
            }}
            className="h-6 rounded-full bg-primary-green text-xs hover:bg-primary-green"
          >
            Time In
          </Button>

          {/* disable the button if past the end time + 1 hour */}
          <TimeoutConfirmation
            deleteHandler={() => roomTimeOut(row, setSubmitted)}
            ButtonTrigger={
              <Button
                disabled={
                  !isPast(
                    parse(
                      formatTimetoLocal(row.beginTime),
                      "h:mm a",
                      new Date(),
                    ),
                  ) ||
                  isPast(
                    addHours(
                      parse(
                        formatTimetoLocal(row.endTime),
                        "h:mm a",
                        new Date(),
                      ),
                      1,
                    ),
                  ) ||
                  selectedRoom?.status === "AVAILABLE"
                }
                className="hover h-6 rounded-full bg-primary-green text-xs hover:bg-primary-green"
              >
                Time Out
              </Button>
            }
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <TimeInConfirmation
        setOpen={setOpen}
        open={open}
        selectedSchedule={selectedSchedule ?? null}
      />
      <Table<scheduleAttributes>
        loading={isPending}
        columns={columns}
        records={paginatedRecords}
        pagination={{
          page,
          pageSize,
          pageCount,
          total: totalRecords,
        }}
        onChangePage={(page) => setPage(page)}
      />
    </>
  );
}
