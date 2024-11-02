import { type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "../..//ui/tabs";

type TabWrapperProps = {
  children: ReactNode;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export default function TabWrapper({
  children,
  activeTab,
  setActiveTab,
}: Readonly<TabWrapperProps>) {
  return (
    <Tabs defaultValue={activeTab} className="">
      {/* <TabsList className="flex w-full rounded-t-2xl  border-2 border-primary-green bg-white px-0 lg:h-16"> */}
      <TabsList className="grid h-10 rounded-t-2xl border-2 border-primary-green bg-white sm:h-16 grid-cols-2">
        <TabsTrigger
          value="room-information"
          onClick={() => setActiveTab && setActiveTab("room-information")}
          className="h-full w-full text-xs sm:rounded-tl-xl  sm:text-base"
        >
          ROOM INFORMATION
        </TabsTrigger>
        <TabsTrigger
          value="room-assignment"
          onClick={() => setActiveTab && setActiveTab("room-assignment")}
          className="h-full w-full rounded-tr-xl text-xs sm:text-base"
        >
          ROOM ASSIGNMENT
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
