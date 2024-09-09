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
import { usePathname } from "next/navigation";
import RoomModalAdmin from "../admin/RoomModalAdmin";
import { useSession } from "next-auth/react";
import RoomModalSecurity from "../security/RoomModalSecurity";

export function RoomLayout() {
  const session = useSession();

  const [open, setOpen] = useState(false);
  const { rooms, setSelectedRoom } = useRoomStore();
  const { filters } = useFilterStore();
  const pathname = usePathname();

  const handleClick = (event: any) => {
    if (event.target.tagName === "path") {
      const roomId = event.target.getAttribute("id");
      filteredRoomsByBuilding.map((item: Room) => {
        if (item.roomName === roomId) {
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

  // Filter the rooms based on the active filters
  const filteredRooms = filteredRoomsByBuilding?.filter((room: any) => {
    if (filters.length >= 1) {
      return filters?.every((filter) => room[filter] === true);
    }
  });

  // Use useEffect to change the fill and stroke color based on room status and filters
  useEffect(() => {
    // First, set the colors based on room status
    filteredRoomsByBuilding?.forEach((room: Room) => {
      const pathElement = document.getElementById(room.roomName);

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

    // Then, override the colors for rooms matching the filters
    if (filters.length !== 0) {
      filteredRooms?.forEach((room: Room) => {
        const pathElement = document.getElementById(room.roomName);
        if (pathElement && room.status !== "OCCUPIED") {
          pathElement.setAttribute("fill", "#91D1FF");
          pathElement.setAttribute("stroke", "#73AED8");
        }
      });
    }
  }, [filteredRoomsByBuilding, filteredRooms, filters.length]); // Dependency array to run the effect when filteredRooms or filters change

  return (
    <div className="">
      <div className="mt-10 flex items-center justify-center">
        <div
          onClick={handleClick}
          className="cursor-pointer overflow-x-scroll sm:overflow-x-hidden"
        >
          {BuildingComponent}
        </div>
        {/* <RoomModal setOpen={setOpen} open={open} /> */}

        {/* eto gagamitin natin para sa modal  */}
        {/* {pathname === "/" && <RoomModal setOpen={setOpen} open={open} />}
        {pathname === "/admin" &&
        session.data?.user.role != "Security Guard" ? (
          <RoomModalAdmin setOpen={setOpen} open={open} />
        ) : (
          <RoomModalSecurity setOpen={setOpen} open={open} />
        )} */}

        {pathname === "/admin" &&
        session.data?.user.role != "Security Guard" ? (
          <RoomModalAdmin setOpen={setOpen} open={open} />
        ) : session.data?.user.role == "Security Guard" ? (
          <RoomModalSecurity setOpen={setOpen} open={open} />
        ) : (
          <RoomModal setOpen={setOpen} open={open} />
        )}
      </div>
    </div>
  );
}
