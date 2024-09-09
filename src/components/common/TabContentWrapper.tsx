import { TabsContent } from "../ui/tabs";
import RoomAssignmentForm from "../forms/RoomAssignmentForm";
import FormattingTable, { type TableColumn } from "../common/FormattingTable";
import RoomDetailsForm from "../forms/RoomDetailsForm";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sched } from "../../app/SampleData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRoomStore } from "~/store/useRoomStore";
import { useState } from "react";

type TabProps = {
    tab_content: string
};

export default function TabContentWrapper({tab_content} : TabProps){
    const { selectedRoom } = useRoomStore();

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    // const [smsLogs, setSmsLogs] = useState<PaginatedList<smsLogs>>(initialPaginatedList);
    
    if (tab_content === "details"){
        return(
            <TabsContent value="details" className="p-5">
                <p className="text-center text-xl font-semibold mb-5"> Room {selectedRoom?.roomName}</p>

                <div className="grid grid-cols-2 px-5 mt-5 space-y-1 font-medium">
                    {selectedRoom?.isLaboratory && <p>Laboratory</p>}
                    {selectedRoom?.isLecture && <p>Lecture</p>}

                    {selectedRoom?.isAirconed && <p>Airconditioned</p>}
                    {selectedRoom?.withTv && <p>With TV</p>}
                    <p>Capacity: {selectedRoom?.capacity}</p>
                    <p>Electric Fan: {selectedRoom?.electricFans}</p>
                    {selectedRoom?.functioningComputers != 0 &&
                    selectedRoom?.notFunctioningComputers != 0 && (
                        <p>
                        Available Computers:{" "}
                        {selectedRoom &&
                            selectedRoom?.functioningComputers +
                            selectedRoom?.notFunctioningComputers}
                        </p>
                    )}
                    <p>
                    Status:{" "}
                    <span className="capitalize">
                        {selectedRoom?.status.toLowerCase()}
                    </span>
                    </p>
                </div>
            </TabsContent>
        );
    }else if (tab_content === "assignform"){
        return(
            <TabsContent value="assignform" className="p-5">
                <p className="text-center text-xl font-semibold mb-5"> Room {selectedRoom?.roomName}</p>

                <RoomAssignmentForm />

                <Input
                type="text"
                id="search"
                placeholder="Search"
                className="float-right my-3 w-1/2 lg:w-2/4"
                />

                {/* <FormattingTable<smsLogs>
                loading={loading}
                columns={columns}
                records={smsLogs.data}
                pagination={smsLogs.meta.pagination}
                onChangePage={(page) => setPage(page)}
                /> */}
            </TabsContent>
        );
    }
    else{
        return(
            <TabsContent value="detailsForm" className="p-5">
                <p className="text-center text-xl font-semibold mb-5"> Room {selectedRoom?.roomName}</p>
                <RoomDetailsForm />
            </TabsContent>
        );
    }
}

// export const columns: TableColumn<smsLogs>[] = [
//     {
//       id: "facultyName",
//       header: "Faculty Name",
//       formatter: (row) => <span>{row.attributes.facultyName}</span>,
//     },
//     {
//       id: "courseCode",
//       header: "Course Code",
//       formatter: (row) => <span>{row.attributes.courseCode}</span>,
//     },
//     {
//       id: "section",
//       header: "Section",
//       formatter: (row) => <span>{row.attributes.section}</span>,
//     },
//     {
//       id: "beginTime",
//       header: "Begin Time",
//       formatter: (row) => <span>{row.attributes.beginTime}</span>,
//     },
//     {
//       id: "endTime",
//       header: "End Time",
//       formatter: (row) => <span>{row.attributes.endTime}</span>,
//     },
//     {
//       id: "day",
//       header: "Day",
//       formatter: (row) => <span>{row.attributes.section}</span>,
//     },
//     {
//       id: "action",
//       header: "Action",
//       formatter: (row) => <span>{row.attributes.action}</span>,
//     },
//   ];