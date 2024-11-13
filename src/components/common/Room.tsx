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

export function RoomLayout({
  selectedLaboratoryType,
}: {
  selectedLaboratoryType: string;
}) {
  const [submittedFeedbackRecords, setSubmittedFeedbackRecords] = useState<
    Set<number>
  >(new Set());

  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomID = searchParams.get("room");
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const { rooms, setSelectedRoom, selectedRoom } = useRoomStore();
  const { filters } = useFilterStore();
  const { selectedBuilding } = useBuildingStore();
  const BuildingComponent = getBuildingComponent(selectedBuilding);
  const filteredRoomsByBuilding = filterRoomsByBuilding(
    rooms,
    selectedBuilding,
  );
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

  const filteredRooms = filteredRoomsByBuilding?.filter((room: any) => {
    if (filters.length >= 1) {
      // Ensure the filter logic includes checks for laboratoryType
      const matchesFilters = filters?.every((filter) => {
        if (filter === "isLaboratory" && room.laboratoryType) {
          return (
            selectedLaboratoryType === "" ||
            room.laboratoryType === selectedLaboratoryType
          );
        } else {
          return room[filter] === true;
        }
      });
      return matchesFilters;
    }
  });

  useEffect(() => {
    const filteredRoomIds = new Set(
      filteredRooms?.map((room: Room) => room.id),
    );

    // Apply colors to rooms based on occupancy status and filters
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

    // Apply specific colors based on filters
    if (filters.length !== 0) {
      filteredRooms?.forEach((room: Room) => {
        const pathElement = document.getElementById(room.id);
        if (pathElement) {
          if (room.status === "OCCUPIED") {
            // Set gray color for occupied filtered rooms
            pathElement.setAttribute("fill", "#C0C0C0");
            pathElement.setAttribute("stroke", "#A9A9A9");
          } else {
            // Set blue color for non-occupied filtered rooms
            pathElement.setAttribute("fill", "#91D1FF");
            pathElement.setAttribute("stroke", "#73AED8");
          }
        }
      });

      // Set unfiltered rooms to gray color
      filteredRoomsByBuilding?.forEach((room: Room) => {
        const pathElement = document.getElementById(room.id);
        if (pathElement && !filteredRoomIds.has(room.id)) {
          pathElement.setAttribute("fill", "#C0C0C0");
          pathElement.setAttribute("stroke", "#A9A9A9");
        }
      });
    }
  }, [
    filteredRoomsByBuilding,
    filteredRooms,
    filters.length,
    selectedLaboratoryType,
  ]);

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
