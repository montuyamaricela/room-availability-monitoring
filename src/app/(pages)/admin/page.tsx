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

  useHotkeys("*", (e) => {
    // Prevent capturing certain keys like Shift, Alt, etc.
    if (e.key.length === 1) {
      setQrCodeBuffer((prevBuffer) => prevBuffer + e.key);
    }

    // console.log(e.key);

    if (e.key === "Enter") {
      handleQRCodeScan();
      e.preventDefault(); // Optional: Prevent default "Enter" behavior
    }
  });

  const handleQRCodeScan = () => {
    const query = `?room=${encodeURIComponent(qrCodeBuffer)}`;

    router.push(`${pathname}${query}`);

    // Reset the QR code buffer after navigating
    setQrCodeBuffer("");
  };

  const {
    data: scheduleRecordsData,
    error: scheduleRecordsError,
    refetch: refetchScheduleRecords,
  } = api.schedule.GetScheduleRecord.useQuery(undefined, {
    refetchInterval: 5000,
  });

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

    // Initial fetch
    void fetchRooms().finally(() => setLoading(false));

    // Polling for data every 5 seconds
    intervalId = setInterval(fetchRooms, 5000);

    return () => clearInterval(intervalId);
  }, [
    rooms,
    scheduleRecordsData,
    scheduleRecordsError,
    setRooms,
    setSchedule,
    setScheduleRecord,
  ]);

  return <>{loading ? <Spinner /> : <Map />}</>;
}
