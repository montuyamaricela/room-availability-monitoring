import React from "react";
import { useRoomStore } from "~/store/useRoomStore";

export default function RoomInfo() {
  const { selectedRoom } = useRoomStore();

  return (
    <div className="px-10 pb-10">
      <div className="space-y-1 font-medium">
        {selectedRoom?.isLaboratory && <p>Laboratory</p>}
        {selectedRoom?.isLecture && <p>Lecture</p>}

        {selectedRoom?.isAirconed && <p>Airconditioned</p>}
        {selectedRoom?.withTv && <p>With TV</p>}
        <p>Capacity: {selectedRoom?.capacity}</p>
        <p>Electric Fan: {selectedRoom?.electricFans}</p>
        {selectedRoom?.functioningComputers != 0 &&
          selectedRoom?.notFunctioningComputers != 0 && (
            <p>
              Available Computers:{" "}
              {selectedRoom &&
                selectedRoom?.functioningComputers +
                  selectedRoom?.notFunctioningComputers}
            </p>
          )}
        <p>
          Status:{" "}
          <span className="capitalize">
            {selectedRoom?.status.toLowerCase()}
          </span>
        </p>
      </div>
    </div>
  );
}
