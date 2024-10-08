import React, { useEffect, useState } from "react";
import { type roomLogsAttributes } from "~/data/models/auditLogs";
import { useLogStore } from "~/store/useLogStore";
import Table, { type TableColumn } from "./Table";
import { format } from "date-fns";
import { TabsContent } from "~/components/ui/tabs";

export default function RoomLogs({ loading }: Readonly<{ loading: boolean }>) {
  const { roomLog } = useLogStore();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  // Calculate total pages
  const [log, setLog] = useState<roomLogsAttributes[]>([]);

  useEffect(() => {
    const auditLogsData = roomLog;
    setLog(auditLogsData as unknown as roomLogsAttributes[]);
  }, [roomLog]);
  const totalRecords = log?.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = log?.slice((page - 1) * pageSize, page * pageSize);

  const columns: TableColumn<roomLogsAttributes>[] = [
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
          {row.loggedBy +
            " " +
            row.activity +
            " " +
            row.facultyName +
            " at " +
            row.roomId +
            (row.careOf && row.careOf !== row.facultyName
              ? " on behalf of " + row.careOf
              : "")}
        </span>
      ),
    },
  ];

  return (
    <TabsContent value="roomLogs">
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
    </TabsContent>
  );
}
