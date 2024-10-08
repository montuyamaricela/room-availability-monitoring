/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useEffect, useState } from "react";
import Map from "~/components/common/Map";
import Spinner from "~/components/common/Spinner";
import { type scheduleAttributes } from "~/data/models/schedule";
import { type PaginatedList } from "~/lib/types";
import { type Room, useRoomStore } from "~/store/useRoomStore";
import { useScheduleStore } from "~/store/useScheduleStore";

export default function Page() {
  const { rooms, setRooms } = useRoomStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { setSchedule } = useScheduleStore();
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const schedResp = await fetch("/api/schedule", {
          method: "GET",
        });

        if (!schedResp.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const scheduleData = await schedResp.json();
        setSchedule(scheduleData as PaginatedList<scheduleAttributes>);
        const data = await response.json();
        // Check if the new data is different before updating the state
        if (JSON.stringify(data) !== JSON.stringify(rooms)) {
          setRooms(data.rooms as unknown as Room[]); // Only update if there's a change
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    // First fetch on component mount
    setLoading(true);
    fetchRooms().finally(() => setLoading(false)); // Ensure loading is updated

    // Set up polling every 5 second
    intervalId = setInterval(fetchRooms, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Add rooms dependency to prevent unnecessary re-renders

  return <>{loading ? <Spinner /> : <Map />} </>;
}
