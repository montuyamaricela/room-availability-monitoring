import React, { type ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  children: ReactNode;
};

const ClickedFeedback = ({ ButtonTrigger, children }: ModalWrapperTypes) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="md:max-w-4/5 w-[90%] bg-custom-gray">
        <div className="p-5">
            <div className="border border-2 border-gray-light rounded-2xl px-3 py-7 bg-white">
                {children} 
            </div>
            <div className="flex justify-center gap-5 mt-5">
                <Button>CANCEL</Button>
                <Button className="bg-primary-green hover:bg-green-light">ACKNOWLEDGE</Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClickedFeedback;