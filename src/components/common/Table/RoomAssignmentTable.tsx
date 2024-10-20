import React, { useEffect, useState } from "react";
import Table, { type TableColumn } from "./Table";
import { type scheduleAttributes } from "~/data/models/schedule";
import { useScheduleStore } from "~/store/useScheduleStore";
import { formatTimetoLocal } from "~/lib/timeSchedule";
import { useRoomStore } from "~/store/useRoomStore";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import DeleteConfirmation from "../Modal/DeleteConfirmation";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { useActivityLog } from "~/lib/createLogs";

export default function RoomAssignmentTable({
  day,
}: Readonly<{ day: string }>) {
  const session = useSession();
  const { logActivity } = useActivityLog();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roomSchedule, setRoomSchedule] = useState<scheduleAttributes[]>([]);
  // const [selectedSchedule, setSelectedSchedule] =
  //   useState<scheduleAttributes>();
  const { schedule } = useScheduleStore();
  const { selectedRoom } = useRoomStore();

  useEffect(() => {
    let filteredData = schedule.data;

    // Filter by room name
    const filteredSched = filteredData.filter(
      (sched) => sched.room.roomName === selectedRoom?.roomName,
    );

    // Filter by search query if provided
    if (searchQuery) {
      filteredData = filteredSched.filter((sched) =>
        sched.facultyName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by day
    if (day) {
      filteredData = filteredSched.filter((sched) => {
        return sched.day === day; // Return the comparison result
      });
    }

    // Set filtered data to state
    setRoomSchedule(filteredData);
    setLoading(false);
  }, [schedule.data, searchQuery, day, selectedRoom?.roomName, deleted]);
  // Calculate total pages
  const totalRecords = roomSchedule.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = roomSchedule.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const { mutate: deleteSchedule, isPending } =
    api.schedule.deleteSchedule.useMutation({
      onSuccess: () => {
        toast.success("Successfully Deleted.");
        setDeleted((current) => !current);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDelete = (
    id: number,
    facultyName: string,
    day: string,
    room: string,
  ) => {
    deleteSchedule({ id: id });
    logActivity(
      session?.data?.user.firstName + " " + session?.data?.user.lastName || "",
      `deleted ${facultyName}'s schedule on ${day} at Room ${room}`,
    );
  };

  const columns: TableColumn<scheduleAttributes>[] = [
    {
      id: "facultyName",
      header: "Faculty Name",
      formatter: (row) => <span>{row.facultyName}</span>,
    },
    {
      id: "section",
      header: "Section",
      formatter: (row) => <span>{row.section}</span>,
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
      id: "day",
      header: "Day",
      formatter: (row) => <span>{row.day}</span>,
    },
    {
      id: "action",
      header: "Action",
      formatter: (row) => (
        <DeleteConfirmation
          deleteHandler={() =>
            handleDelete(
              row ? row?.id : 0,
              row.facultyName,
              row.day,
              row.room.roomName,
            )
          }
          ButtonTrigger={
            <Button className="h-7 w-20 items-center rounded-full bg-primary-red hover:bg-primary-red">
              Delete
            </Button>
          }
        />
      ),
    },
  ];

  return (
    <div className="mt-5 ">
      <Table<scheduleAttributes>
        loading={loading}
        columns={columns}
        records={paginatedRecords}
        pagination={{
          page,
          pageSize,
          pageCount,
          total: totalRecords,
        }}
        onChangePage={(page: number) => setPage(page)}
      />
    </div>
  );
}
