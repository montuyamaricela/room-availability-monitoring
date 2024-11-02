import { TabsContent } from "../../ui/tabs";
import RoomAssignmentForm from "../../forms/RoomAssignmentForm";
import RoomDetailsForm from "../../forms/RoomDetailsForm";
import { useRoomStore } from "~/store/useRoomStore";
import RoomInfo from "../Modal/RoomInfo";
import RoomAssignmentTable from "../Table/RoomAssignmentTable";
import { api } from "~/trpc/react";
import { useState } from "react";

type TabProps = {
  activeTab: string;
  handleTabChange: (activeTab: string) => void;
};

export default function TabContentWrapper({
  activeTab,
  handleTabChange,
}: Readonly<TabProps>) {
  const { selectedRoom } = useRoomStore();

  const { data } = api.schedule.getAllFaculty.useQuery();

  const filteredFaculties = Array.from(
    new Set(data?.map((faculty) => faculty.facultyName)),
  ).map((facultyName) => ({ facultyName }));

  const faculties =
    filteredFaculties?.map((item) => {
      return { label: item.facultyName, value: item.facultyName };
    }) || [];

  faculties.push({ label: "Other", value: "Other" });

  const [day, setDay] = useState<string>("");

  const renderItem = () => {
    if (activeTab === "room-information") {
      return (
        <div className="my-auto flex h-full w-full flex-col justify-center ">
          <p className="mb-5 text-center text-xl font-semibold">
            {" "}
            Room {selectedRoom?.roomName}
          </p>
          <RoomDetailsForm />
        </div>
      );
    } else if (activeTab === "room-assignment") {
      return (
        <div className="overflow-x-hidden">
          <p className="mb-5 text-center text-xl font-semibold">
            {" "}
            Room {selectedRoom?.roomName}
          </p>
          <RoomAssignmentForm faculty={faculties ?? []} setDay={setDay} />
          <RoomAssignmentTable day={day} />
        </div>
      );
    }
  };
  return (
    <div className="my-auto h-[600px] max-h-[600px] min-h-[600px] w-full overflow-y-scroll sm:overflow-auto">
      <TabsContent
        value={activeTab}
        onClick={() => handleTabChange(activeTab)}
        className="sm:h-[90%] p-5"
      >
        {renderItem()}
      </TabsContent>
    </div>
  );
}
