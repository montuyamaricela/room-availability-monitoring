"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormattingTable, { type TableColumn } from "../common/FormattingTable";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export default function Schedule() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  // const [smsLogs, setSmsLogs] = useState<PaginatedList<smsLogs>>(initialPaginatedList);

//   const columns: TableColumn<smsLogs>[] = [
//     {
//       id: "facultyName",
//       header: "Faculty Name",
//       formatter: (row) => <span>{row.attributes.facultyName}</span>,
//     },
//     {
//       id: "department",
//       header: "Department",
//       formatter: (row) => <span>{row.attributes.department}</span>,
//     },
//     {
//       id: "section",
//       header: "Section",
//       formatter: (row) => <span>{row.attributes.section}</span>,
//     },
//     {
//       id: "room",
//       header: "Room",
//       formatter: (row) => <span>{row.attributes.room}</span>,
//     },
//     {
//       id: "schedule",
//       header: "Schedule",
//       formatter: (row) => <span>{row.attributes.schedule}</span>,
//     },
//     {
//       id: "startTime",
//       header: "Start time",
//       formatter: (row) => <span>{row.attributes.startTime}</span>,
//     },
//     {
//       id: "endTime",
//       header: "End time",
//       formatter: (row) => <span>{row.attributes.endTime}</span>,
//     },
//     {
//       id: "action",
//       header: "Action",
//       formatter: (row) => <span>{row.attributes.action}</span>,
//     },
//   ];

  return (
    <Container>
      <div className="flex justify-center items-center">
        <div className="rounded shadow-md border border-gray-light drop-shadow-md w-full p-8">
          <p className="text-gray-dark font-semibold text-xl mb-5">Schedule</p>

          <div className="flex flex-col md:flex-row gap-5 justify-between mb-7">
            <div className="flex gap-2 mb-2">
                <Input type="text" id="filterBy" placeholder="Filter by"/>
                <Input type="text" id="search" placeholder="Search..."/>
            </div>
            <Button className="px-10 items-center bg-[#FF8383] hover:bg-[#C54F4F]">
                RESET
            </Button>
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