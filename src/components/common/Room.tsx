/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from "react";
import RoomModal from "./Modal/roomModal";
import getBuildingComponent from "../rooms/getBuildingComponent";
import { useBuildingStore } from "~/store/useBuildingStore";
import { type Room, useRoomStore } from "~/store/useRoomStore";
import { filterRoomsByBuilding } from "~/lib/filterRoomsByBuilding";
import { useFilterStore } from "~/store/useFilterStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RoomModalAdmin from "../admin/RoomModalAdmin";
import { useSession } from "next-auth/react";
import RoomModalSecurity from "../security/RoomModalSecurity";

export function RoomLayout() {
  // Create a Set to store the record IDs or faculty names that already received feedback
  const [submittedFeedbackRecords, setSubmittedFeedbackRecords] = useState<
    Set<number>
  >(new Set());

  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomID = searchParams.get("room");

  const [open, setOpen] = useState(false);
  const { rooms, setSelectedRoom, selectedRoom } = useRoomStore();
  const { filters } = useFilterStore();
  const pathname = usePathname();

  const handleClick = (event: any) => {
    if (event.target.tagName === "path") {
      const roomId = event.target.getAttribute("id");

      filteredRoomsByBuilding.map((item: Room) => {
        if (item.id === roomId) {
          setOpen(true);
          setSelectedRoom(item);
        }
      });
    }
  };
  const { selectedBuilding } = useBuildingStore();
  const BuildingComponent = getBuildingComponent(selectedBuilding);
  const filteredRoomsByBuilding = filterRoomsByBuilding(
    rooms,
    selectedBuilding,
  );

  useEffect(() => {
    if (!rooms || !roomID) return; // Only run if roomID exists and modal is closed

    const selectedRoomFromParams = rooms?.filter((room: any) => {
      return room.id.toLowerCase() === roomID.toLowerCase();
    });
    setSelectedRoom(selectedRoomFromParams[0] as unknown as Room);
    if (selectedRoomFromParams.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [roomID, rooms, setSelectedRoom]); // Dependencies: rooms, roomID, open

  // Filter the rooms based on the active filters
  const filteredRooms = filteredRoomsByBuilding?.filter((room: any) => {
    if (filters.length >= 1) {
      return filters?.every((filter) => room[filter] === true);
    }
  });
  useEffect(() => {
    filteredRoomsByBuilding?.forEach((room: Room) => {
      const pathElement = document.getElementById(room.id);
      if (pathElement) {
        if (room.status === "OCCUPIED") {
          pathElement.setAttribute("fill", "#FF8383");
          pathElement.setAttribute("stroke", "#C54F4F");
        } else {
          pathElement.setAttribute("fill", "#43D370");
          pathElement.setAttribute("stroke", "#38A35A");
        }
      }
    });

    if (filters.length !== 0) {
      filteredRooms?.forEach((room: Room) => {
        const pathElement = document.getElementById(room.id);
        if (pathElement && room.status !== "OCCUPIED") {
          pathElement.setAttribute("fill", "#91D1FF");
          pathElement.setAttribute("stroke", "#73AED8");
        }
      });
    }
  }, [filteredRoomsByBuilding, filteredRooms, filters.length]); // Dependency array to run the effect when filteredRooms or filters change

  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <div
          onClick={handleClick}
          className="cursor-pointer overflow-auto pb-5"
        >
          {BuildingComponent}
        </div>

        {pathname === "/admin" && session.data?.user.role == "Admin" ? (
          <RoomModalAdmin setOpen={setOpen} open={open} />
        ) : session.data?.user.role == "Security Guard" ? (
          <RoomModalSecurity
            setOpen={setOpen}
            open={open}
            setSubmittedFeedbackRecords={setSubmittedFeedbackRecords}
            submittedFeedbackRecords={submittedFeedbackRecords}
          />
        ) : session.data?.user.role == "Super Admin" ? (
          <RoomModalAdmin setOpen={setOpen} open={open} />
        ) : (
          <RoomModal setOpen={setOpen} open={open} />
        )}
      </div>
    </div>
  );
}
