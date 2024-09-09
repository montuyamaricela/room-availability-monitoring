import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useRoomStore } from "~/store/useRoomStore";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RoomModal({ open, setOpen }: roomModalProps) {
  const { selectedRoom } = useRoomStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-4/5 w-[90%] ">
        <DialogHeader className={`rounded-t-2xl py-5 ${selectedRoom?.status === "OCCUPIED" ? "bg-[#FF8383]" : "bg-primary-green"}`}>
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Room Details
          </DialogTitle>
        </DialogHeader>
        <div className="px-10 pb-10">
          <p className="text-center text-xl font-medium">
            Room {selectedRoom?.roomName}
          </p>
          <div className="mt-5 space-y-1 font-medium">
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
      </DialogContent>
    </Dialog>
  );
}
