import { TabsContent } from "../../ui/tabs";
import RoomAssignmentForm from "../../forms/RoomAssignmentForm";
import RoomDetailsForm from "../../forms/RoomDetailsForm";
import { useRoomStore } from "~/store/useRoomStore";
import RoomInfo from "../Modal/RoomInfo";
import RoomAssignmentTable from "../Table/RoomAssignmentTable";
import { api } from "~/trpc/react";
import Spinner from "../Spinner";

type TabProps = {
  activeTab: string;
  handleTabChange: (activeTab: string) => void;
};

type facultyType = {
  faculty: {
    label: string;
    value: string;
  };
};

export default function TabContentWrapper({
  activeTab,
  handleTabChange,
}: TabProps) {
  const { selectedRoom } = useRoomStore();
  const { data, isLoading, error, refetch } =
    api.faculty.getAllFaculty.useQuery();

  const faculties = data?.map((item) => {
    return { label: item.facultyName, value: item.facultyName };
  });

  const renderItem = () => {
    if (activeTab === "room-information") {
      return (
        <div>
          {/* <RoomInfo /> */}
          <RoomInfo />
        </div>
      );
    } else if (activeTab === "room-assignment") {
      return (
        <div>
          <>
            <RoomAssignmentForm faculty={faculties ?? []} />
            <RoomAssignmentTable />
          </>
        </div>
      );
    } else if (activeTab === "room-details") {
      return <RoomDetailsForm />;
    }
  };
  return (
    <div className="my-auto h-[400px] max-h-[400px] min-h-[400px] w-full overflow-y-scroll sm:overflow-auto">
      <TabsContent
        value={activeTab}
        onClick={() => handleTabChange(activeTab)}
        className="p-5"
      >
        <p className="mb-5 text-center text-xl font-semibold">
          {" "}
          Room {selectedRoom?.roomName}
        </p>
        {renderItem()}
      </TabsContent>
    </div>
  );
}
