/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useEffect, useState } from "react";
import Map from "~/components/common/Map";
import Spinner from "~/components/common/Spinner";
import { type Room, useRoomStore } from "~/store/useRoomStore";

export default function Page() {
  const { rooms, setRooms } = useRoomStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!rooms.length) {
      const fetchRooms = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/rooms", {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch rooms");
          }

          const data: Room[] = await response.json();

          // Set the rooms in the Zustand store
          setRooms(data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        } finally {
          setLoading(false); // Ensure loading is set to false in both success and error cases
        }
      };
      fetchRooms();
    }
  }, [rooms.length, setRooms]);

  return <>{loading ? <Spinner /> : <Map />} </>;
}
