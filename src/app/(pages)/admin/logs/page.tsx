"use client";

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import Logs from "~/components/common/Logs";
import Spinner from "~/components/common/Spinner";
import {
  type roomLogsAttributes,
  type activityLogsAttributes,
} from "~/data/models/auditLogs";
import { type PaginatedList } from "~/lib/types";
import { useLogStore } from "~/store/useLogStore";
import { api } from "~/trpc/react";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true); // Initially loading is true

  const { setActivityLogs, setRoomLog } = useLogStore();

  const {
    data: activityLogsData,
    isLoading: isActivityLogsLoading,
    error: activityLogsError,
    refetch: refetchActivityLogs,
  } = api.logs.getActivityLogs.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const {
    data: roomLogsData,
    error: roomLogsError,
    refetch: refetchRoomLogs,
  } = api.logs.getRoomLogs.useQuery(undefined, {
    refetchInterval: 5000, // Automatically refetch every 5 seconds
  });

  useEffect(() => {
    if (activityLogsData) {
      // Assuming the data you get is a list of activity logs
      setActivityLogs(
        activityLogsData as unknown as PaginatedList<activityLogsAttributes>,
      );
    }
    if (activityLogsError) {
      console.error("Error fetching activity logs:", activityLogsData);
    }

    if (roomLogsData) {
      // Assuming the data you get is a list of activity logs
      setRoomLog(roomLogsData as unknown as PaginatedList<roomLogsAttributes>);
    }
    if (roomLogsError) {
      console.error("Error fetching room logs:", roomLogsError);
    }

    // Set loading to false after the first successful fetch
    setLoading(isActivityLogsLoading);
  }, [
    activityLogsData,
    roomLogsData,
    isActivityLogsLoading,
    setActivityLogs,
    activityLogsError,
    roomLogsError,
  ]);

  return <>{loading ? <Spinner /> : <Logs loading={loading} />}</>;
}
