import React, { useEffect, useState } from "react";
import {
  type scheduleRecordsAttributes,
  type scheduleAttributes,
} from "~/data/models/schedule";
import Table, { type TableColumn } from "../common/Table/Table";
import { useRoomStore } from "~/store/useRoomStore";
import {
  addHours,
  addMinutes,
  format,
  isPast,
  parse,
  subHours,
} from "date-fns";
import { Button } from "../ui/button";
import { formatTimetoLocal } from "~/lib/timeSchedule";
import TimeInConfirmation from "../common/Modal/TimeInConfirmation";
import roomTimeOut from "~/hooks/roomTimeOut";
import TimeoutConfirmation from "../common/Modal/TimeoutConfirmation";
import { useScheduleStore } from "~/store/useScheduleStore";
import { useSession } from "next-auth/react";
import { useRoomLog } from "~/lib/createLogs";
import { useTimeOut } from "~/lib/roomScheduleLog";
import { useFeedbackAutomation } from "~/lib/feedbackAutomation";

export default function ScheduleTable({
  isSubmitted,
  setSubmitted,
  setOpenModal,
  submittedFeedbackRecords,
  setSubmittedFeedbackRecords,
}: {
  isSubmitted: boolean;
  setSubmitted: (submitted: boolean) => void;
  setOpenModal: (open: boolean) => void;
  submittedFeedbackRecords: Set<number>;
  setSubmittedFeedbackRecords: React.Dispatch<
    React.SetStateAction<Set<number>>
  >;
}) {
  const currentDate = new Date();
  const session = useSession();
  const { logActivity } = useRoomLog();
  const { timeOutRoom } = useTimeOut();
  const { automateFeedback } = useFeedbackAutomation();
  const { rooms, selectedRoom } = useRoomStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleted, setDeleted] = useState<boolean>(false);
  const { schedule, scheduleRecord } = useScheduleStore();

  // Time in confirmation modal state
  const [open, setOpen] = useState<boolean>(false);

  const [roomSchedule, setRoomSchedule] = useState<scheduleAttributes[]>([]);
  const [roomScheduleRecords, setRoomScheduleRecords] = useState<
    scheduleRecordsAttributes[]
  >([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [selectedSchedule, setSelectedSchedule] =
    useState<scheduleAttributes>();

  // Calculate total pages

  useEffect(() => {
    let filteredData = schedule.data;
    let filteredRoomScheduleRecord =
      (scheduleRecord as unknown as scheduleRecordsAttributes[]) ?? [];
    const filteredScheduleRecords = filteredRoomScheduleRecord?.filter(
      (record) =>
        record?.roomSchedule?.room?.id &&
        record.roomSchedule.room.id === selectedRoom?.id,
    );

    filteredRoomScheduleRecord = filteredScheduleRecords?.filter((rec) => {
      return rec.roomSchedule.day === format(currentDate, "EEEE");
    });
    setRoomScheduleRecords(filteredRoomScheduleRecord);

    // Filter by room name
    const filteredSched = filteredData.filter(
      (sched) => sched.roomId === selectedRoom?.id,
    );

    filteredData = filteredSched.filter((sched) => {
      return sched.day === format(currentDate, "EEEE"); // Return the comparison result
    });

    setRoomSchedule(filteredData);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleRecord, rooms, selectedRoom?.status]);

  const totalRecords = roomSchedule.length;
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Get records for the current page
  const paginatedRecords = roomSchedule.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    if (selectedSchedule?.roomId) {
      let facultyName = selectedSchedule.faculty.facultyName;
      roomScheduleRecords?.map((item) => {
        if (item.roomScheduleId === selectedSchedule.id) {
          facultyName = item.facultyName;
        }
      });

      logActivity(
        session?.data?.user?.firstName + " " + session?.data?.user?.lastName,
        "returned the key",
        facultyName,
        facultyName,
        selectedSchedule?.roomId,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleted]);
  function isFacultyTimedIn(id: number) {
    return roomScheduleRecords.some(
      (record) =>
        record.roomScheduleId === id &&
        record.timeIn != null &&
        record.timeOut == null,
    );
  }
  // Check if the faculty is 15 minutes past scheduled end time and did not return the key
  useEffect(() => {
    roomSchedule?.forEach((record) => {
      const endTime = parse(
        formatTimetoLocal(record.endTime),
        "h:mm a",
        new Date(),
      );
      const fifteenMinutesAfterEnd = addMinutes(endTime, 15);
      roomScheduleRecords.forEach((rec) => {
        // If it's past the time and the record hasn't had feedback submitted yet
        if (rec.timeIn != null && rec.timeOut === null) {
          if (rec.facultyName === record.faculty.facultyName) {
            if (
              isPast(fifteenMinutesAfterEnd) &&
              !submittedFeedbackRecords.has(record.id)
            ) {
              const feedbackMessage = `${rec.facultyName} did not return the key after their scheduled Time Out at Room ${record.room.roomName}`;
              automateFeedback(record.faculty.department ?? "BSIT (CICS)", feedbackMessage);

              // Add the record ID to the set to prevent duplicate feedback
              setSubmittedFeedbackRecords((prevSet) =>
                new Set(prevSet).add(record.id),
              );
            }
          }
        }
      });
    });
  }, [
    automateFeedback,
    roomSchedule,
    roomScheduleRecords,
    setSubmittedFeedbackRecords,
    submittedFeedbackRecords,
  ]);

  function canTimeOut(id: number) {
    let canTimeOut = false;

    const item = roomScheduleRecords?.find(
      (item) => item.roomScheduleId === id,
    );

    if (item) {
      canTimeOut = item.timeOut === null && item.timeIn != null;
    }

    return canTimeOut;
  }

  function timeOutSchedule(row: scheduleAttributes | null) {
    if (!row) return;

    let facultyName = row?.faculty.facultyName;
    roomScheduleRecords?.map((item: scheduleRecordsAttributes) => {
      if (item.roomScheduleId === row?.id) {
        timeOutRoom(item.id);
        facultyName = item?.facultyName;
      }
    });

    const updatedRow = {
      ...row,
      facultyName,
    };
    setOpen(false);
    void roomTimeOut(updatedRow, setSubmitted, setDeleted);

    setTimeout(() => {
      setOpenModal(false);
    }, 2000);
  }

  const columns: TableColumn<scheduleAttributes>[] = [
    {
      id: "facultyName",
      header: "Faculty Name",
      width: 100,
      formatter: (row) => (
        <span
          className={
            isFacultyTimedIn(row.id)
              ? "font-bold text-primary-green" // Color for timed-in faculty
              : ""
          }
        >
          {row.faculty.facultyName}
        </span>
      ),
    },
    {
      id: "section",
      header: "Section",
      width: 100,
      formatter: (row) => (
        <span
          className={
            isFacultyTimedIn(row.id)
              ? "font-bold text-primary-green" // Color for timed-in faculty
              : ""
          }
        >
          {row?.section}
        </span>
      ),
    },
    {
      id: "Subject",
      header: "Subject",
      width: 100,
      formatter: (row) => (
        <span
          className={
            isFacultyTimedIn(row.id)
              ? "font-bold text-primary-green" // Color for timed-in faculty
              : ""
          }
        >
          {row?.courseCode}
        </span>
      ),
    },
    {
      id: "Begin Time",
      header: "Begin Time",
      width: 100,
      formatter: (row) => (
        <span
          className={
            isFacultyTimedIn(row.id)
              ? "font-bold text-primary-green" // Color for timed-in faculty
              : ""
          }
        >
          {formatTimetoLocal(row.beginTime)}
        </span>
      ),
    },
    {
      id: "End Time",
      header: "End Time",
      width: 100,
      formatter: (row) => (
        <span
          className={
            isFacultyTimedIn(row.id)
              ? "font-bold text-primary-green" // Color for timed-in faculty
              : ""
          }
        >
          {formatTimetoLocal(row.endTime)}
        </span>
      ),
    },
    {
      id: "Action",
      header: "Action",
      formatter: (row) => (
        <span className="flex justify-start gap-2">
          {/* disable the button if time is past end time  */}
          <Button
            disabled={
              !isPast(
                subHours(
                  parse(
                    formatTimetoLocal(new Date(row.beginTime)),
                    "h:mm a",
                    new Date(),
                  ),
                  1,
                ),
              ) ||
              isPast(
                parse(formatTimetoLocal(row.endTime), "h:mm a", new Date()),
              ) ||
              selectedRoom?.status === "OCCUPIED"
            }
            onClick={() => {
              setSelectedSchedule(row);
              setOpen(true);
            }}
            className="h-6 rounded-full bg-primary-green text-xs hover:bg-primary-green"
          >
            Borrowed
          </Button>

          {/* disable the button if past the end time + 1 hour */}
          <TimeoutConfirmation
            deleteHandler={() => {
              setSelectedSchedule(row);
              timeOutSchedule(row);
              setLoading(true);
            }}
            ButtonTrigger={
              <Button
                disabled={
                  !isPast(
                    parse(
                      formatTimetoLocal(row.beginTime),
                      "h:mm a",
                      new Date(),
                    ),
                  ) ||
                  // isPast(
                  //   addHours(
                  //     parse(
                  //       formatTimetoLocal(row.endTime),
                  //       "h:mm a",
                  //       new Date(),
                  //     ),
                  //     1,
                  //   ),
                  // ) ||
                  selectedRoom?.status === "AVAILABLE" ||
                  !canTimeOut(row.id)
                }
                className="hover h-6 rounded-full bg-green-light text-xs hover:bg-primary-green"
              >
                Returned
              </Button>
            }
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <TimeInConfirmation
        setOpen={setOpen}
        setOpenModal={setOpenModal}
        open={open}
        setLoading={setLoading}
        selectedSchedule={selectedSchedule ?? null}
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
    </>
  );
}
