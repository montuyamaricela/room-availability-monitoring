import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

type roomModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function PendingKeyModal ({ open, setOpen }: roomModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-4/5 w-[90%] ">
          <DialogHeader className="rounded-t-2xl bg-[#C54F4F] py-5">
            <DialogTitle className="text-center text-xl font-medium uppercase text-white">
                Pending Key Returns
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-dark p-5">
            <p >216A PANCHO HALL   -   Faculty name</p>
          </div>
      </DialogContent>
    </Dialog>
  );
}