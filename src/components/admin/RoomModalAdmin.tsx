import React, { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TabContentWrapper from "../common/Tab/TabContentWrapper";
import TabWrapper from "../common/Tab/TabWrapper";
import { useRoomStore } from "~/store/useRoomStore";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

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
  const [activeTab, setActiveTab] = useState<string>("room-assignment");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogHeader>
        <VisuallyHidden.Root>
          <DialogDescription>Room Modal Admin</DialogDescription>
          <DialogTitle>Room Modal Admin</DialogTitle>
        </VisuallyHidden.Root>
      </DialogHeader>
      <DialogContent className="max-w-[60%]">
        <TabWrapper activeTab={activeTab} setActiveTab={setActiveTab}>
          <TabContentWrapper
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
        </TabWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalAdmin;
