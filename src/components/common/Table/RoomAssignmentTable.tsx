import React, { useEffect, useState } from "react";
import Table, { type TableColumn } from "./Table";
import { type scheduleAttributes } from "~/data/models/schedule";
import { useScheduleStore } from "~/store/useScheduleStore";

export default function RoomAssignmentTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roomSchedule, setRoomSchedule] = useState<scheduleAttributes[]>([]);
  const [selectedSchedule, setSelectedSchedule] =
    useState<scheduleAttributes>();
  const { schedule } = useScheduleStore();
  useEffect(() => {
    let filteredData = schedule.data;
    // Filter by search query if provided
    if (searchQuery) {
      filteredData = filteredData.filter((sched) =>
        sched.facultyName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Set filtered data to state
    setRoomSchedule(filteredData);
  }, [schedule.data, searchQuery]);

  // Calculate total pages
  const totalRecords = roomSchedule.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = roomSchedule.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

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
      id: "beginTime",
      header: "Begin Time",
      formatter: (row) => <span>{row.beginTime}</span>,
    },
    {
      id: "endTime",
      header: "End Time",
      formatter: (row) => <span>{row.endTime}</span>,
    },
    {
      id: "day",
      header: "Day",
      formatter: (row) => <span>{row.day}</span>,
    },
    {
      id: "action",
      header: "Action",
      formatter: (row) => <span className="text-primary-red">Delete</span>,
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
