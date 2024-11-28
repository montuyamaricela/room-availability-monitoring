/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
"use client";
import { useEffect, useState } from "react";
import Map from "~/components/common/Map";
import Spinner from "~/components/common/Spinner";
import {
  type scheduleRecordsAttributes,
  type scheduleAttributes,
} from "~/data/models/schedule";
import { type PaginatedList } from "~/lib/types";
import { type Room, useRoomStore } from "~/store/useRoomStore";
import { useScheduleStore } from "~/store/useScheduleStore";
import { api } from "~/trpc/react";
import { useHotkeys } from "react-hotkeys-hook";
import { usePathname, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const { rooms, setRooms } = useRoomStore();
  const [loading, setLoading] = useState<boolean>(true);
  const { setSchedule, setScheduleRecord } = useScheduleStore();
  const [qrCodeBuffer, setQrCodeBuffer] = useState("");
  const SCAN_COMPLETE_DELAY = 100;
  let scanTimeout: string | number | NodeJS.Timeout | undefined;

  useHotkeys("*", (e) => {
    if (e.key.length === 1) {
      setQrCodeBuffer((prevBuffer) => {
        const updatedBuffer = prevBuffer + e.key;
        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(() => {
          handleQRCodeScan(updatedBuffer);
        }, SCAN_COMPLETE_DELAY);

        return updatedBuffer;
      });
    }

    e.preventDefault();
  });

  const handleQRCodeScan = (buffer: string) => {
    const query = `?room=${encodeURIComponent(buffer)}`;
    router.push(`${pathname}${query}`);
    setQrCodeBuffer("");
  };

  const {
    data: scheduleRecordsData,
    error: scheduleRecordsError,
    refetch: refetchScheduleRecords,
  } = api.schedule.GetScheduleRecord.useQuery(undefined, {
    refetchInterval: 1000,
  });

  // Fetch rooms and schedule data with polling every 5 seconds
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRooms = async () => {
      try {
        const [roomResponse, scheduleResponse] = await Promise.all([
          fetch("/api/rooms", { method: "GET" }),
          fetch("/api/schedule", { method: "GET" }),
        ]);

        if (!roomResponse.ok) throw new Error("Failed to fetch rooms");
        if (!scheduleResponse.ok) throw new Error("Failed to fetch schedule");

        const roomData = await roomResponse.json();
        const scheduleData =
          (await scheduleResponse.json()) as PaginatedList<scheduleAttributes>;

        // Update rooms only if there are changes
        if (JSON.stringify(roomData.rooms) !== JSON.stringify(rooms)) {
          setRooms(roomData.rooms as unknown as Room[]);
        }

        // Update schedule
        setSchedule(scheduleData);

        // Update schedule records if available
        setScheduleRecord(
          scheduleRecordsData as unknown as PaginatedList<scheduleRecordsAttributes>,
        );

        // Handle any errors in fetching schedule records
        if (scheduleRecordsError) {
          console.error("Error fetching activity logs:", scheduleRecordsError);
        }
      } catch (error) {
        console.error("Error fetching rooms or schedule:", error);
      }
    };

    // Polling for room and schedule data every 5 seconds
    intervalId = setInterval(fetchRooms, 5000);

    // Initial fetch
    void fetchRooms().finally(() => setLoading(false));

    return () => {
      clearInterval(intervalId);
    };
  }, [
    rooms,
    scheduleRecordsData,
    scheduleRecordsError,
    setRooms,
    setSchedule,
    setScheduleRecord,
  ]);

  // Fetch pending notifications only once when the component mounts
  useEffect(() => {
    const fetchPendingNotifications = async () => {
      try {
        const response = await fetch("/api/pending-notif", { method: "GET" });
        if (!response.ok)
          throw new Error("Failed to fetch pending notifications");
        console.log("Fetched pending notifications successfully");
      } catch (error) {
        console.error("Error fetching pending notifications:", error);
      }
    };

    // Fetch once when the component mounts
    void fetchPendingNotifications();
  }, []);

  return <>{loading ? <Spinner /> : <Map />}</>;
}
