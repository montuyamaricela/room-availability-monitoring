/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React, { useEffect, useState } from "react";
import Map from "~/components/common/Map";
import TabletRoomModal from "~/components/common/Modal/TabletRoomModal";
import Spinner from "~/components/common/Spinner";
import {
  type scheduleAttributes,
  type scheduleRecordsAttributes,
} from "~/data/models/schedule";
import { type PaginatedList } from "~/lib/types";
import { type Room, useRoomStore } from "~/store/useRoomStore";
import { useScheduleStore } from "~/store/useScheduleStore";
import { api } from "~/trpc/react";

type PageProps = {
  params: {
    page: string[];
  };
  searchParams: {
    page: string;
  };
};

export default function Page({ params }: PageProps) {
  const { page } = params;
  const { rooms, setRooms, setSelectedRoom } = useRoomStore();
  const [loading, setLoading] = useState<boolean>(true);
  const { setSchedule, setScheduleRecord } = useScheduleStore();
  const [openModal, setOpenModal] = useState<boolean>(false);
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

        rooms.map((room) => {
          if (room.id === page[0]?.toUpperCase()) {
            setSelectedRoom(room);
          }
        }),
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

    void fetchRooms().finally(() => setLoading(false));
    setTimeout(() => {
      setOpenModal(true);
    }, 1000);

    intervalId = setInterval(fetchRooms, 5000);

    return () => clearInterval(intervalId);
  }, [
    page,
    rooms,
    scheduleRecordsData,
    scheduleRecordsError,
    setRooms,
    setSchedule,
    setScheduleRecord,
    setSelectedRoom,
  ]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <TabletRoomModal open={openModal} />
          <Map />
        </>
      )}
    </>
  );
}
