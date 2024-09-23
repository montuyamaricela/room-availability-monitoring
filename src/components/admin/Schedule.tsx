"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { type TableColumn } from "../common/Table/Table";
import { useEffect, useState } from "react";
import { type scheduleAttributes } from "~/data/models/schedule";
import { useScheduleStore } from "~/store/useScheduleStore";
import {
  days,
  DepartmentDropdown,
  departments,
} from "../ui/department-dropdown";
import { Label } from "../ui/label";
import DeleteConfirmation from "../common/Modal/DeleteConfirmation";
import ScheduleModal from "../common/Modal/ScheduleModal";
import { deleteSchedule } from "~/hooks/deleteSchedules";
import toast, { Toaster } from "react-hot-toast";
import NotAllowed from "../common/NotAllowed";
import { useSession } from "next-auth/react";
import Spinner from "../common/Spinner";
import Table from "../common/Table/Table";
import { format, parse } from "date-fns";
import { formatTimetoLocal } from "~/lib/timeSchedule";

export default function Schedule({ loading }: { loading: boolean }) {
  const session = useSession();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [open, setOpen] = useState<boolean>(false);
  const [department, setDepartment] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roomSchedule, setRoomSchedule] = useState<scheduleAttributes[]>([]);
  const [selectedSchedule, setSelectedSchedule] =
    useState<scheduleAttributes>();
  const { schedule } = useScheduleStore();
  useEffect(() => {
    let filteredData = schedule.data;
    // Filter by search query if provided
    if (searchQuery) {
      filteredData = filteredData.filter((sched) =>
        sched.facultyName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    // // Filter by department if selected
    // if (department) {
    //   filteredData = filteredData.filter(
    //     (sched) => sched.faculties[0].department === department,
    //   );
    // }

    if (day) {
      filteredData = filteredData.filter((sched) => sched.day === day);
    }
    // Set filtered data to state
    setRoomSchedule(filteredData);
  }, [day, department, schedule.data, searchQuery]);

  // Calculate total pages
  const totalRecords = roomSchedule.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = roomSchedule.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const columns: TableColumn<scheduleAttributes>[] = [
    {
      id: "facultyName",
      header: "Faculty Name",
      width: 100,
      formatter: (row) => <span>{row?.facultyName}</span>,
    },
    // {
    //   id: "department",
    //   header: "Department",
    //   width: 60,
    //   formatter: (row) => <span>{row?.faculties[0]?.department}</span>,
    // },
    {
      id: "section",
      header: "Section",
      width: 100,
      formatter: (row) => <span>{row?.section}</span>,
    },
    {
      id: "room",
      header: "Room",
      width: 100,
      formatter: (row) => (
        <>
          {row.room.roomName != "Old Canteen" &&
          !row.room.roomName.toLowerCase().includes("mpg") &&
          !row.room.roomName.toLowerCase().includes("hangar") ? (
            <>
              <span className="capitalize">
                {row.room.building.split("_").join(" ").toLowerCase()} -{" "}
                {row.room.roomName}
              </span>
            </>
          ) : (
            <span className="capitalize">{row?.room?.roomName}</span>
          )}
        </>
      ),
    },
    {
      id: "schedule",
      header: "Schedule",
      width: 100,
      formatter: (row) => (
        <span>
          {row.day} {formatTimetoLocal(row.beginTime)} to{" "}
          {formatTimetoLocal(row.endTime)}
        </span>
      ),
    },
    {
      id: "Action",
      header: "Action",
      formatter: (row) => (
        <span className="flex justify-center">
          <Button
            onClick={() => openModal(row.id)}
            className="bg-primary-green px-8 hover:bg-primary-green"
          >
            View
          </Button>
        </span>
      ),
    },
  ];

  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const openModal = (id: number) => {
    const selectedSched = roomSchedule.find((item) => item.id === id);
    setSelectedSchedule(selectedSched);
    setOpen(true); // Open the modal
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);
  if (session.status === "loading") {
    return <Spinner />;
  }
  if (session.data?.user.role != "Super Admin") {
    return <NotAllowed />;
  }
  return (
    <Container>
      <ScheduleModal
        setOpen={setOpen}
        open={open}
        selectedSchedule={selectedSchedule}
      />
      <Toaster />
      <div className="flex items-center justify-center">
        <div className="w-full rounded border border-gray-light p-8 shadow-md drop-shadow-md">
          <p className="mb-5 text-xl font-semibold text-gray-dark">Schedule</p>

          <div className="mb-5 flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex flex-col gap-2">
                <Label>Department: </Label>
                <DepartmentDropdown
                  data={departments}
                  setDropdownValue={setDepartment}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Day: </Label>
                <DepartmentDropdown data={days} setDropdownValue={setDay} />
              </div>
            </div>
            <div className="flex w-full flex-col items-end justify-between gap-5 sm:flex-row">
              <div className="flex w-full flex-col gap-2">
                <Label>Search: </Label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  id="search"
                  className="lg:w-96"
                  placeholder="Search..."
                />
              </div>
              {session.data.user.role === "Super Admin" && (
                <DeleteConfirmation
                  deleteHandler={() =>
                    deleteSchedule({ setLoading: setLoadingStatus, setMessage })
                  }
                  ButtonTrigger={
                    <Button className="items-center bg-primary-green hover:bg-primary-green">
                      {loadingStatus ? "Resetting..." : "RESET SCHEDULES"}
                    </Button>
                  }
                />
              )}
            </div>
          </div>

          <div>
            <Table<scheduleAttributes>
              loading={loading}
              columns={columns}
              records={paginatedRecords}
              pagination={{
                page,
                pageSize,
                pageCount,
                total: totalRecords,
              }}
              onChangePage={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
