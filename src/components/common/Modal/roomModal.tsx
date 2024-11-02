import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useRoomStore } from "~/store/useRoomStore";
import RoomInfo from "./RoomInfo";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RoomModal({ open, setOpen }: roomModalProps) {
  const { selectedRoom } = useRoomStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-4/5 w-[90%] ">
        <DialogHeader
          className={`rounded-t-2xl py-5 ${selectedRoom?.status === "OCCUPIED" ? "bg-[#C54F4F]" : "bg-primary-green"}`}
        >
          <DialogTitle className="text-center text-2xl font-medium uppercase text-white">
            Room Details
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-2xl text-gray-dark font-bold">
          Room {selectedRoom?.roomName}
        </p>
        <RoomInfo />
      </DialogContent>
    </Dialog>
  );
}
