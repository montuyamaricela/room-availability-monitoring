import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import TabContentWrapper from "../common/TabContentWrapper";

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const RoomModalAdmin = ({
  ButtonTrigger,
  open,
  setOpen,
}: ModalWrapperTypes) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="max-h-[91%] max-w-[92%] lg:max-w-[65%] overflow-auto">
        <Tabs defaultValue="room">
          <DialogHeader className="rounded-t-2xl">
            <DialogTitle>
              <TabsList className="mb-4 w-full rounded-t-2xl border-2 border-primary-green">
                <TabsTrigger
                  value="details"
                  className="h-full w-full rounded-tl-xl text-base"
                >
                  ROOM DETAILS
                </TabsTrigger>
                <TabsTrigger
                  value="assignform"
                  className="h-full w-full text-base"
                >
                  ROOM ASSIGNMENT FORM
                </TabsTrigger>
                <TabsTrigger
                  value="detailsForm"
                  className="h-full w-full rounded-tr-xl text-base"
                >
                  ROOM DETAILS FORM
                </TabsTrigger>
              </TabsList>
            </DialogTitle>
          </DialogHeader>

          <TabContentWrapper tab_content="details"/>

          <TabContentWrapper tab_content="assignform"/>

          <TabContentWrapper tab_content="detailsForm"/>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalAdmin;