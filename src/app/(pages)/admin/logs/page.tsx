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
import { type Room, useRoomStore } from "~/store/useRoomStore";
import { useScheduleStore } from "~/store/useScheduleStore";
import { api } from "~/trpc/react";

export default function Page() {
  const session = useSession();

  const [loading, setLoading] = useState<boolean>(true); // Initially loading is true
  const { setScheduleRecord } = useScheduleStore();
  const { setActivityLogs, setRoomLog } = useLogStore();
  const { rooms, setRooms } = useRoomStore();

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
    const fetchData = async () => {
      try {
        const roomResponse = await fetch("/api/rooms", { method: "GET" });

        if (!roomResponse.ok) throw new Error("Failed to fetch rooms");

        const roomData = await roomResponse.json();
        // Update rooms only if there are changes
        if (JSON.stringify(roomData.rooms) !== JSON.stringify(rooms)) {
          setRooms(roomData.rooms as unknown as Room[]);
        }

        if (activityLogsData) {
          setActivityLogs(
            activityLogsData as unknown as PaginatedList<activityLogsAttributes>,
          );
        }
        if (activityLogsError) {
          console.error("Error fetching activity logs:", activityLogsData);
        }

        if (roomLogsData) {
          setRoomLog(
            roomLogsData as unknown as PaginatedList<roomLogsAttributes>,
          );
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
        if (!isActivityLogsLoading && !isRoomLogsLoading) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching rooms or schedule:", error);
      }
    };

    fetchData(); // Call fetchData only once
  }, [
    activityLogsData,
    roomLogsData,
    setActivityLogs,
    activityLogsError,
    roomLogsError,
    setRoomLog,
    setScheduleRecord,
    rooms,
  ]);

  if (session.status === "loading") {
    return <Spinner />;
  }

  if (session?.data?.user?.role === "Room Viewer") {
    return <NotAllowed />;
  }
  return <>{loading ? <Spinner /> : <Logs loading={loading} />}</>;
}
