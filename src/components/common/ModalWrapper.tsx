import React, { type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  children: ReactNode;
};

const ModalWrapper = ({ ButtonTrigger, children }: ModalWrapperTypes) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="md:max-w-4/5 w-[90%] bg-white p-10 ">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
