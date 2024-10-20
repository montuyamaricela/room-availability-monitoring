import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useRoomStore } from "~/store/useRoomStore";
import { useScheduleStore } from "~/store/useScheduleStore";
import { type scheduleRecordsAttributes } from "~/data/models/schedule";
import { formatTimetoLocal } from "~/lib/timeSchedule";

type roomModalProps = {
  open: boolean;
};

export default function TabletRoomModal({ open }: roomModalProps) {
  const { selectedRoom } = useRoomStore();
  const { scheduleRecord, schedule } = useScheduleStore();
  const [facultyName, setFacultyName] = useState<string>("");
  const [subjectAndSection, setSubjectAndSection] = useState<string>("");
  const [timeInAt, setTimeInAt] = useState<string>("");
  const [timeOutAt, setTimeOutAt] = useState<string>("");

  useEffect(() => {
    const filteredRoomScheduleRecord =
      (scheduleRecord as unknown as scheduleRecordsAttributes[]) ?? [];
    const roomSchedule = schedule.data;

    const filterSchedBySelectedRoom = filteredRoomScheduleRecord?.filter(
      (item) => {
        if (
          item?.roomSchedule?.room?.roomName &&
          item.roomSchedule.room.roomName === selectedRoom?.roomName &&
          selectedRoom.status != "AVAILABLE"
        ) {
          if (item.timeOut === null && item.timeIn != null) {
            return item;
          }
        }
      },
    );

    const filterScheduleByFacultyAndRoom = roomSchedule?.filter((schedule) => {
      if (schedule.room.roomName === selectedRoom?.roomName) {
        if (schedule.id === filterSchedBySelectedRoom[0]?.roomScheduleId) {
          return schedule;
        }
      }
    });

    if (filterSchedBySelectedRoom[0]) {
      setSubjectAndSection(
        filterScheduleByFacultyAndRoom[0]?.courseCode +
          " " +
          filterScheduleByFacultyAndRoom[0]?.section || "-",
      );
      setFacultyName(filterSchedBySelectedRoom[0]?.facultyName ?? "");
      setSubjectAndSection(
        filterScheduleByFacultyAndRoom[0]?.courseCode +
          " " +
          filterScheduleByFacultyAndRoom[0]?.section || "-",
      );
      if (
        filterScheduleByFacultyAndRoom[0]?.beginTime &&
        filterScheduleByFacultyAndRoom[0]?.endTime
      ) {
        setTimeInAt(
          formatTimetoLocal(filterScheduleByFacultyAndRoom[0]?.beginTime),
        );

        setTimeOutAt(
          formatTimetoLocal(filterScheduleByFacultyAndRoom[0]?.endTime),
        );
      }
    }
  }, [scheduleRecord, selectedRoom, schedule]);

  useEffect(() => {
    if (selectedRoom?.status === "AVAILABLE") {
      setTimeInAt(""), setTimeOutAt("");
      setFacultyName("");
      setSubjectAndSection("");
    }
  }, [selectedRoom?.status]);

  return (
    <Dialog open={open}>
      <DialogContent className="md:max-w-4/5 w-[90%] ">
        <DialogHeader
          className={`rounded-t-2xl py-5 ${selectedRoom?.status === "OCCUPIED" ? "bg-[#C54F4F]" : "bg-primary-green"}`}
        >
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Room Details
          </DialogTitle>
        </DialogHeader>

        <div className="px-10 pb-5">
          <p className="text-center text-xl font-medium">
            Room {selectedRoom?.roomName}
          </p>
          <div className="mt-5 space-y-2 text-sm sm:mb-0">
            <div className="flex items-center gap-1">
              <p className="font-medium">Room status: </p>
              <div
                className={`w-28 rounded-full  text-center text-sm font-medium text-white ${selectedRoom?.status === "OCCUPIED" ? "bg-primary-red" : "bg-primary-green"}`}
              >
                <p>{selectedRoom?.status}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Occupied By: {facultyName}</p>
              <p className="font-medium">
                Subject & Section: {subjectAndSection ?? ""}
              </p>
              <p className="font-medium">Timed In At: {timeInAt ?? ""}</p>
              <p className="font-medium">Scheduled out at: {timeOutAt ?? ""}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
