/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type BuildingName } from "~/components/rooms/getBuildingComponent";
import { type Room } from "~/store/useRoomStore";

export function filterRoomsByBuilding(
  rooms: any,
  building: BuildingName,
): Room[] {
  return rooms?.rooms?.filter((room: Room) => room.building === building);
}
