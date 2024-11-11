/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { format } from "date-fns";
import React, { useState } from "react";
import { type roomLogsAttributes } from "~/data/models/auditLogs";
import Table, { type TableColumn } from "./Table";

type exportRoomLogsProps = {
  loading: boolean;
  roomLogs: roomLogsAttributes[];
};

export default function ExportRoomLogs({
  loading,
  roomLogs,
}: exportRoomLogsProps) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const totalRecords = roomLogs?.length ?? 0;
  const pageCount = Math.ceil(totalRecords / pageSize);

  const paginatedRecords =
    roomLogs?.slice((page - 1) * pageSize, page * pageSize) ?? 0;

  const columns: TableColumn<roomLogsAttributes>[] = [
    {
      id: "logID",
      header: "Log #",
      formatter: (row) => <span>{row.id}</span>,
    },
    {
      id: "Activity",
      header: "Activity",
      formatter: (row) => {
        return <span>{row.activity}</span>;
      },
    },
    {
      id: "Borrowed Time",
      header: "Borrowed Time",
      formatter: (row) => (
        <span>
          {row?.borrowedAt ? format(new Date(row.borrowedAt), "h:mm a") : ""}
        </span>
      ),
    },
    {
      id: "Returned Time",
      header: "Returned Time",
      formatter: (row) => (
        <span>
          {row.returnedAt ? format(new Date(row?.returnedAt), "h:mm a") : ""}
        </span>
      ),
    },
    {
      id: "Date",
      header: "Date",
      formatter: (row) => (
        <span>
          {row.borrowedAt
            ? format(new Date(row?.borrowedAt), "MMM dd, yyyy")
            : ""}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table<roomLogsAttributes>
        loading={loading}
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
    </div>
  );
}
