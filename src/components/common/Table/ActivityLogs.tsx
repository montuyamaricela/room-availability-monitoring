import React, { useEffect, useState } from "react";
import { type activityLogsAttributes } from "~/data/models/auditLogs";
import { useLogStore } from "~/store/useLogStore";
import Table, { type TableColumn } from "./Table";
import { format } from "date-fns";
import { TabsContent } from "~/components/ui/tabs";
import { useScheduleStore } from "~/store/useScheduleStore";

export default function ActivityLogs({
  loading,
}: Readonly<{ loading: boolean }>) {
  const { activityLog } = useLogStore();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  // Calculate total pages
  const [log, setLog] = useState<activityLogsAttributes[]>([]);

  useEffect(() => {
    const auditLogsData = activityLog;
    setLog(auditLogsData as unknown as activityLogsAttributes[]);
  }, [activityLog]);
  const totalRecords = log?.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = log?.slice((page - 1) * pageSize, page * pageSize);

  const columns: TableColumn<activityLogsAttributes>[] = [
    {
      id: "transactaionNumber",
      header: "Transaction #",
      formatter: (row) => <span>{row.id}</span>,
    },

    {
      id: "Activity",
      header: "Activity",
      formatter: (row) => <span>{row.userName + " " + row.activity}</span>,
    },
    {
      id: "Date and Time",
      header: "Date and Time",
      formatter: (row) => (
        <span>{format(new Date(row.dateTime), "MMM dd, yyyy h:mm:ss a")}</span>
      ),
    },
  ];

  return (
    <TabsContent value="activityLogs">
      <Table<activityLogsAttributes>
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
