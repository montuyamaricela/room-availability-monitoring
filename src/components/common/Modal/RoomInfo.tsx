import React from "react";
import { useRoomStore } from "~/store/useRoomStore";

export default function RoomInfo() {
  const { selectedRoom } = useRoomStore();

  return (
    <div className="px-10 pb-10">
      <div className="space-y-1 font-medium">
        <center>
          <p
            className={`w-44 rounded-full py-1 text-center capitalize text-sm font-medium text-white md:w-56 md:text-lg ${selectedRoom?.status === "OCCUPIED" ? "bg-primary-red" : "bg-primary-green"}`}
          >
            {selectedRoom?.status?.toLowerCase()}
          </p>
        </center>
        
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
      </div>
    </div>
  );
}
