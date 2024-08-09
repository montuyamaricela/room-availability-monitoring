import React from "react";
import { Rooms } from "../../app/SampleData";
import ModalWrapper from "./ModalWrapper";

const roomLayout = [
  [1, 2, 3, 4, "H", 5],
  ["H", "H", "H", "H", "H", 6],
  [7, 8, 9, 10, "H", 11],
];

export function RoomLayout() {
  return (
    <div className="overflow-x-scroll pb-5 sm:overflow-x-hidden">
      <div className="mt-10 grid w-max  grid-cols-6  gap-2 sm:w-full ">
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
            <div key={index}>
              <ModalWrapper
                title="Room Details"
                ButtonTrigger={
                  <div className="flex h-20 items-center justify-center border border-gray-300 bg-green-200">
                    Room {room?.RoomNumber}
                  </div>
                }
              >
                <div className="px-10 pb-10">
                  <p className="text-center text-xl font-medium">
                    Room {room?.RoomNumber}
                  </p>
                  <div className="mt-5 space-y-1 font-medium">
                    <p>Laboratory</p>
                    <p>Airconditioned</p>
                    <p>With TV</p>
                    <p>Capacity: 20</p>
                    <p>Electric Fan: 20</p>
                  </div>
                </div>
              </ModalWrapper>
            </div>
          );
        })}
      </div>
    </div>
  );
}
