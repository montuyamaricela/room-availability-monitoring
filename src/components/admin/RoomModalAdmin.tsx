import React, { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import TabContentWrapper from "../common/Tab/TabContentWrapper";
import TabWrapper from "../common/Tab/TabWrapper";
import { useRoomStore } from "~/store/useRoomStore";

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
  const [activeTab, setActiveTab] = useState<string>("room-details");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="w-[90%] max-w-3xl ">
        <TabWrapper setActiveTab={setActiveTab}>
          <TabContentWrapper
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
        </TabWrapper>
        {/* <div className="my-auto max-h-[600px] min-h-[600px] w-full overflow-y-scroll  lg:max-h-[400px] lg:min-h-[400px]">
            <TabContentWrapper tab_content={activeTab} />
          </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalAdmin;
