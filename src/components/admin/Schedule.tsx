"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { type TableColumn } from "../common/Table/Table";
import { useEffect, useState } from "react";
import { type scheduleAttributes } from "~/data/models/schedule";
import { useScheduleStore } from "~/store/useScheduleStore";
import { days, DepartmentDropdown } from "../ui/department-dropdown";
import { Label } from "../ui/label";
import DeleteConfirmation from "../common/Modal/DeleteConfirmation";
import ScheduleModal from "../common/Modal/ScheduleModal";
import { deleteSchedule } from "~/hooks/deleteSchedules";
import toast, { Toaster } from "react-hot-toast";
import NotAllowed from "../common/NotAllowed";
import { useSession } from "next-auth/react";
import Spinner from "../common/Spinner";
import Table from "../common/Table/Table";
import { formatTimetoLocal } from "~/lib/timeSchedule";
import UploadScheduleModal from "../common/Modal/UploadScheduleModal";
import { useActivityLog } from "~/lib/createLogs";
import RequestSchedule from "../common/Modal/RequestSchedule";

export default function Schedule({ loading }: { loading: boolean }) {
  const session = useSession();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [open, setOpen] = useState<boolean>(false);
  const [openScheduleUpload, setOpenScheduleUpload] = useState<boolean>(false);
  const [openRequestScheduleModal, setOpenRequestScheduleModal] =
    useState<boolean>(false);

  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roomSchedule, setRoomSchedule] = useState<scheduleAttributes[]>([]);
  const { logActivity } = useActivityLog();
  const [selectedSchedule, setSelectedSchedule] =
    useState<scheduleAttributes>();
  const { schedule, clearSchedule } = useScheduleStore();

  const filteredDepartment = Array.from(
    new Set(
      schedule?.data
        ?.map((item) => item.department)
        .filter(
          (department) => department !== null && department !== undefined,
        ),
    ),
  ).map((department) => ({ department }));

  const departments =
    filteredDepartment?.map((item) => {
      return { label: item?.department ?? "", value: item?.department ?? "" };
    }) || [];

  departments.unshift({ label: "All", value: "" });

  useEffect(() => {
    let filteredData = schedule.data;
    // Filter by search query if provided
    if (searchQuery) {
      filteredData = filteredData.filter((sched) =>
        sched.facultyName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by department if selected
    if (department) {
      filteredData = filteredData.filter((sched) => {
        return sched.department === department;
      });
    }

    if (day) {
      filteredData = filteredData.filter((sched) => sched.day === day);
    }

    // Set filtered data to state
    setRoomSchedule(filteredData);
  }, [day, searchQuery, message, schedule.data, department]);

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
    {
      id: "department",
      header: "Department",
      width: 60,
      formatter: (row) => <span>{row?.department}</span>,
    },
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
        <span className="">
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

  const openModal = (id: number) => {
    const selectedSched = roomSchedule.find((item) => item.id === id);
    setSelectedSchedule(selectedSched);
    setOpen(true); // Open the modal
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      clearSchedule();
      logActivity(
        session.data?.user.firstName + " " + session?.data?.user?.lastName ||
          "",
        "resetted schedule",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  if (session.status === "loading") {
    return <Spinner />;
  }
  if (session.data?.user.role === "Security Guard") {
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
                  placeholder="Search faculty..."
                />
              </div>
              {/* /// here */}
              <Button
                onClick={() => setOpenScheduleUpload(true)}
                className="bg-primary-green hover:bg-primary-green"
              >
                Upload Schedule
              </Button>
              {session?.data?.user.role === "Super Admin" && (
                <Button
                  onClick={() => setOpenRequestScheduleModal(true)}
                  className="bg-primary-green hover:bg-primary-green"
                >
                  Request Schedule
                </Button>
              )}
            </div>
          </div>

          <div>
            <UploadScheduleModal
              open={openScheduleUpload}
              setOpen={setOpenScheduleUpload}
            />
            <RequestSchedule
              open={openRequestScheduleModal}
              setOpen={setOpenRequestScheduleModal}
            />
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
            <div className="flex justify-end">
              {session?.data?.user.role === "Super Admin" && (
                <DeleteConfirmation
                  deleteHandler={() =>
                    deleteSchedule({
                      setLoading: setLoadingStatus,
                      setMessage,
                    })
                  }
                  ButtonTrigger={
                    <Button className="mt-5 bg-primary-green hover:bg-primary-green">
                      {loadingStatus ? "Resetting..." : "RESET SCHEDULES"}
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
