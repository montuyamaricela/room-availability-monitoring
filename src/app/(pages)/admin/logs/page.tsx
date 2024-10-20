/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSession } from "next-auth/react";
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import Logs from "~/components/common/Logs";
import NotAllowed from "~/components/common/NotAllowed";
import Spinner from "~/components/common/Spinner";
import {
  type roomLogsAttributes,
  type activityLogsAttributes,
} from "~/data/models/auditLogs";
import { type scheduleRecordsAttributes } from "~/data/models/schedule";
import { type PaginatedList } from "~/lib/types";
import { useLogStore } from "~/store/useLogStore";
import { useScheduleStore } from "~/store/useScheduleStore";
import { api } from "~/trpc/react";

export default function Page() {
  const session = useSession();

  const [loading, setLoading] = useState<boolean>(true); // Initially loading is true
  const { setScheduleRecord } = useScheduleStore();
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
    data: scheduleRecordsData,
    error: scheduleRecordsError,
    refetch: refetchScheduleRecords,
  } = api.schedule.GetScheduleRecord.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const {
    data: roomLogsData,
    isLoading: isRoomLogsLoading,
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

    if (scheduleRecordsData) {
      setScheduleRecord(
        scheduleRecordsData as unknown as PaginatedList<scheduleRecordsAttributes>,
      );
    }

    // Set loading to false after the first successful fetch
    setLoading(isActivityLogsLoading);
    setLoading(isRoomLogsLoading);
  }, [
    activityLogsData,
    roomLogsData,
    isActivityLogsLoading,
    setActivityLogs,
    activityLogsError,
    roomLogsError,
    setRoomLog,
    isRoomLogsLoading,
  ]);

  if (session.status === "loading") {
    return <Spinner />;
  }

  if (session.data?.user.role != "Super Admin") {
    return <NotAllowed />;
  }

  return <>{loading ? <Spinner /> : <Logs loading={loading} />}</>;
}
