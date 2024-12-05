import React, { useEffect, useState } from "react";
import { useRoomStore } from "~/store/useRoomStore";
import { STATUS, ICON } from "../FacultyRoomDetails";
import { Tooltips } from "../TooltipInformation";

export default function RoomInfo() {
  const { selectedRoom } = useRoomStore();
  const Status = selectedRoom?.status === "OCCUPIED" ? "OCCUPIED" : "AVAILABLE";

  const test = selectedRoom?.isAirconed && selectedRoom?.withTv ? true : false;
  const [modalWidth, setModalWidth] = useState(window.innerWidth); // Initialize with the window width
  const handleResize = () => {
    setModalWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="px-10 pb-12">
      <div className="space-y-1 font-medium">
        <div className="flex flex-col items-center justify-center">
          <STATUS status={Status} />

          <div
            className={`mt-8 flex items-center justify-center gap-5 text-gray-dark ${modalWidth <= 480 && test ? " flex-col " : " "}`}
          >
            {selectedRoom?.isLaboratory &&
              (selectedRoom?.laboratoryType ? (
                <p>{selectedRoom.laboratoryType}</p>
              ) : (
                <p>Laboratory</p>
              ))}
            {selectedRoom?.isLecture && <p>Lecture</p>}

            {selectedRoom?.isAirconed && (
              <p
                className={`border-gray-dark ${modalWidth <= 480 && test ? " border-t-2 pt-5" : "border-l-2 pl-5"}`}
              >
                Airconditioned
              </p>
            )}
            {selectedRoom?.withTv && (
              <p
                className={`border-gray-dark ${modalWidth <= 480 && test ? " border-t-2 pt-5" : "border-l-2 pl-5"}`}
              >
                With TV
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-8 overflow-auto text-gray-dark">
            <Tooltips
              icons={
                <div className="flex cursor-pointer gap-2">
                  <ICON icon={"capacity"} />
                  <p> {selectedRoom?.capacity} </p>
                </div>
              }
            >
              <p> Number of Chairs </p>
            </Tooltips>

            <Tooltips
              icons={
                <div className="flex cursor-pointer gap-2">
                  <ICON icon={"eFan"} />
                  <p> {selectedRoom?.electricFans} </p>
                </div>
              }
            >
              <p>Electric Fan</p>
            </Tooltips>

            {selectedRoom && selectedRoom?.functioningComputers != 0 && (
              <Tooltips
                icons={
                  <div className="flex cursor-pointer gap-2">
                    <ICON icon={"computers"} />
                    <p> {selectedRoom?.functioningComputers} </p>
                  </div>
                }
              >
                <p>Computers</p>
              </Tooltips>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
