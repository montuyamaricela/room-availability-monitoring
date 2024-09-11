"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { DatePickerDemo } from "../ui/DatePicker";
import FormattingTable, { type TableColumn } from "./Table/Table";
import { useState } from "react";
import { ActivityLog } from "../../app/SampleData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function ActivityLogs() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  // const [smsLogs, setSmsLogs] = useState<PaginatedList<smsLogs>>(initialPaginatedList);

  // const columns: TableColumn<smsLogs>[] = [
  //   {
  //     id: "transactaionNumber",
  //     header: "Transaction #",
  //     formatter: (row) => <span>{row.attributes.transactaionNumber}</span>,
  //   },
  //   {
  //     id: "dateAndTime",
  //     header: "Date and Time",
  //     formatter: (row) => <span>{row.attributes.dateAndTime}</span>,
  //   },
  //   {
  //     id: "activities",
  //     header: "Activities",
  //     formatter: (row) => <span>{row.attributes.activities}</span>,
  //   },
  // ];

  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full rounded border border-gray-light p-8 shadow-md drop-shadow-md lg:w-4/5">
          <p className="text-xl font-semibold text-gray-dark">ACTIVITY LOGS</p>
          <hr className="border-t-1 mb-7 mt-1 border border-gray-light" />

          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row">
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
          </div>

          <div>
            {/* <FormattingTable<smsLogs>
              loading={loading}
              columns={columns}
              records={smsLogs.data}
              pagination={smsLogs.meta.pagination}
              onChangePage={(page) => setPage(page)}
            /> */}
          </div>
        </div>
      </div>
    </Container>
  );
}
