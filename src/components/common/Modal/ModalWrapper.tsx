import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  children: ReactNode;
  title?: string;
};

const ModalWrapper = ({
  ButtonTrigger,
  children,
  title,
}: ModalWrapperTypes) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="md:max-w-4/5 w-[90%] ">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-5">
          {title && (
            <DialogTitle className="text-center text-xl font-medium uppercase text-white">
              {title}
            </DialogTitle>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
