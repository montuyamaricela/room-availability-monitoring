/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import BarcodeList from "~/components/admin/BarcodeList";
import NotAllowed from "~/components/common/NotAllowed";
import Spinner from "~/components/common/Spinner";
import { type Room, useRoomStore } from "~/store/useRoomStore";

export default function Page() {
  const session = useSession();
  const [loading, setLoading] = useState<boolean>(true); // Initially loading is true
  const { rooms, setRooms } = useRoomStore();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRooms = async () => {
      try {
        const [roomResponse] = await Promise.all([
          fetch("/api/rooms", { method: "GET" }),
        ]);

        if (!roomResponse.ok) throw new Error("Failed to fetch rooms");

        const roomData = await roomResponse.json();

        // Update rooms only if there are changes
        if (JSON.stringify(roomData.rooms) !== JSON.stringify(rooms)) {
          setRooms(roomData.rooms as unknown as Room[]);
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
  }, [rooms, setRooms]);

  if (session.status === "loading") {
    return <Spinner />;
  }

  if (session.data?.user.role != "Super Admin") {
    return <NotAllowed />;
  }

  return <>{loading ? <Spinner /> : <BarcodeList />}</>;
}
