/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";
import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { DatePickerDemo } from "../ui/DatePicker";
import { type TableColumn } from "./Table/Table";
import { useEffect, useState } from "react";

import { type auditLogsAttributes } from "~/data/models/auditLogs";
import Table from "./Table/Table";
import { useLogStore } from "~/store/useLogStore";
import { format } from "date-fns";

export default function ActivityLogs({
  loading,
}: Readonly<{ loading: boolean }>) {
  const { auditLog } = useLogStore();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  // Calculate total pages
  const [log, setLog] = useState<auditLogsAttributes[]>([]);

  useEffect(() => {
    const auditLogsData = auditLog.data;
    setLog(auditLogsData);
  }, [auditLog]);

  const totalRecords = log.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = log.slice((page - 1) * pageSize, page * pageSize);

  const columns: TableColumn<auditLogsAttributes>[] = [
    {
      id: "transactaionNumber",
      header: "Transaction #",
      formatter: (row) => <span>{row.id}</span>,
    },
    {
      id: "Date and Time",
      header: "Date and Time",
      formatter: (row) => (
        <span>{format(new Date(row.dateTime), "MMM dd, yyyy h:mm:ss a")}</span>
      ),
    },
    {
      id: "Activities",
      header: "Activities",
      formatter: (row) => (
        <span>
          {row.facultyName +
            " " +
            row.activity +
            " by " +
            row.loggedBy +
            " Care of " +
            row.careOf}
        </span>
      ),
    },
  ];

  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full rounded border border-gray-light p-8 shadow-md drop-shadow-md lg:w-4/5">
          <p className="text-xl font-semibold text-gray-dark">ACTIVITY LOGS</p>
          <hr className="border-t-1 mb-7 mt-1 border border-gray-light" />

          {/* will add functionalities here after the admin side */}
          {/* <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row">
            <Input
              type="text"
              id="search"
              placeholder="Search"
              className="mb-2 w-full md:mb-0 md:w-1/3"
              required
            />
            <div className="flex gap-2">
              <DatePickerDemo />
              <DatePickerDemo />
            </div>
          </div> */}

          <div>
            <Table<auditLogsAttributes>
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
        </div>
      </div>
    </Container>
  );
}
