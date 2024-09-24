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
      <TabsList className="grid h-10 grid-cols-2 rounded-t-2xl border-2 border-primary-green sm:h-16 ">
        <TabsTrigger
          value="room-assignment"
          onClick={() => setActiveTab && setActiveTab("room-assignment")}
          className="hidden h-full w-full rounded-tl-xl text-xs sm:block sm:text-base"
        >
          ROOM ASSIGNMENT
        </TabsTrigger>
        <TabsTrigger
          value="room-information"
          onClick={() => setActiveTab && setActiveTab("room-information")}
          className="h-full w-full rounded-tl-xl text-xs  sm:rounded-none sm:text-base"
        >
          ROOM INFORMATION
        </TabsTrigger>
        {/* <TabsTrigger
          value="room-details"
          onClick={() => setActiveTab && setActiveTab("room-details")}
          className="h-full w-full rounded-tr-xl text-xs sm:text-base"
        >
          ROOM DETAILS
        </TabsTrigger> */}
      </TabsList>
      {children}
    </Tabs>
  );
}
