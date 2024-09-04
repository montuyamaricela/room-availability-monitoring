import React from "react";
import ModalWrapper from "../ModalWrapper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  roomID: string;
};

export default function RoomModal({ open, setOpen, roomID }: roomModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger> */}
      <DialogContent className="md:max-w-4/5 w-[90%] ">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-5">
          {roomID && (
            <DialogTitle className="text-center text-xl font-medium uppercase text-white">
              {roomID}
            </DialogTitle>
          )}
        </DialogHeader>
        <div className="px-10 pb-10">
          <p className="text-center text-xl font-medium">Room {roomID}</p>
          <div className="mt-5 space-y-1 font-medium">
            <p>Laboratory</p>
            <p>Airconditioned</p>
            <p>With TV</p>
            <p>Capacity: 20</p>
            <p>Electric Fan: 20</p>
          </div>
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
}
