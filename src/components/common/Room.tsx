import React from "react";
import { Rooms } from "../../app/SampleData";

const roomLayout = [
  [1, 2, 3, 4, "H", 5],
  ["H", "H", "H", "H", "H", 6],
  [7, 8, 9, 10, "H", 11],
];

export function RoomLayout() {
  return (
    <div className="mt-10 grid grid-cols-6 gap-2">
      {roomLayout.flat().map((cell, index) => {
        if (cell === "H") {
          return (
            <div
              key={index}
              className="flex h-20 items-center justify-center border border-gray-300 bg-gray-200"
            >
              Hallway
            </div>
          );
        }
        const room = Rooms.find((r) => r.id === cell);
        return (
          <div
            key={index}
            className="flex h-20 items-center justify-center border border-gray-300 bg-green-200"
          >
            Room {room?.RoomNumber}
          </div>
        );
      })}
    </div>
  );
}
