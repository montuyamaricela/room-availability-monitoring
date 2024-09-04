/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from "react";
import CBAROOM from "../rooms/Cba";
import RoomModal from "./Modal/roomModal";

export function RoomLayout() {
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const handleClick = (event: any) => {
    if (event.target.tagName === "path") {
      const roomId = event.target.getAttribute("id");
      setOpen(true);
      setSelectedRoom(roomId as string);
      // Perform your logic based on the room ID
    }
  };

  return (
    <div className="overflow-x-scroll sm:overflow-x-hidden">
      <div className="flex items-center justify-center">
        <div onClick={handleClick}>
          <CBAROOM />
        </div>
        <RoomModal setOpen={setOpen} open={open} roomID={selectedRoom} />
      </div>
    </div>
  );
}
