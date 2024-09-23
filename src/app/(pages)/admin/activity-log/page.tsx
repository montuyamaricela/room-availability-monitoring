"use client";

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import ActivityLogs from "~/components/common/ActivityLogs";
import { type auditLogsAttributes } from "~/data/models/auditLogs";
import { type PaginatedList } from "~/lib/types";
import { useLogStore } from "~/store/useLogStore";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);

  const { setAuditLogs } = useLogStore();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/audit-log", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch audit Logs");
        }

        const data = await response.json();
        setAuditLogs(data as PaginatedList<auditLogsAttributes>);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    setLoading(true);
    fetchRooms().finally(() => setLoading(false)); // Ensure loading is updated

    // Set up polling every 5 second
    intervalId = setInterval(fetchRooms, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return <ActivityLogs loading={loading} />;
}
