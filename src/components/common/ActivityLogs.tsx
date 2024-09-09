"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { DatePickerDemo } from "../ui/DatePicker";
import FormattingTable, { type TableColumn } from "../common/FormattingTable";
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
      <div className="flex justify-center items-center">
        <div className="rounded shadow-md border border-gray-light drop-shadow-md lg:w-4/5 w-full p-8">
          <p className="text-gray-dark font-semibold text-xl">ACTIVITY LOGS</p>
          <hr className="mt-1 mb-7 border border-gray-light border-t-1"/>
          
          <div className="flex flex-col md:flex-row gap-5 justify-between mb-7">
            <Input type="text" id="search" placeholder="Search" className="md:w-1/3 w-full md:mb-0 mb-2" required/>
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