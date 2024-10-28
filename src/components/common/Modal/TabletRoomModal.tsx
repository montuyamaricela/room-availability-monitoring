import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useRoomStore } from "~/store/useRoomStore";
import { useScheduleStore } from "~/store/useScheduleStore";
import {
  type scheduleAttributes,
  type scheduleRecordsAttributes,
} from "~/data/models/schedule";
import { formatTimetoLocal } from "~/lib/timeSchedule";
import { format } from "date-fns";

type roomModalProps = {
  open: boolean;
};

export default function TabletRoomModal({ open }: roomModalProps) {
  const currentDate = new Date();

  const { selectedRoom } = useRoomStore();
  const { scheduleRecord, schedule } = useScheduleStore();
  const [facultyName, setFacultyName] = useState<string>("");
  const [subjectAndSection, setSubjectAndSection] = useState<string>("");
  const [timeInAt, setTimeInAt] = useState<string>("");
  const [timeOutAt, setTimeOutAt] = useState<string>("");
  const [roomSchedule, setRoomSchedule] = useState<scheduleAttributes[]>([]);

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
    const getCurrentDayRoomSchedule = roomSchedule.filter((schedule) => {
      if (schedule.room.roomName === selectedRoom?.roomName) {
        if (schedule.day === format(currentDate, "EEEE")) {
          return schedule;
        }
      }
    });

    setRoomSchedule(getCurrentDayRoomSchedule);
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
      <DialogContent className="max-w-[95%] md:max-w-[60%]">
        <DialogHeader
          className={`rounded-t-2xl py-5 ${selectedRoom?.status === "OCCUPIED" ? "bg-[#C54F4F]" : "bg-primary-green"}`}
        >
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Room {selectedRoom?.roomName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-5 pb-10 md:grid md:grid-cols-2 md:px-10 ">
          <div className="">
            <p className="flex justify-center text-center text-lg font-semibold md:hidden">
              {format(currentDate, "EEEE")} Schedule
            </p>
            <div className="mt-5 space-y-5 sm:mb-0">
              <div
                className={`w-44 rounded-full py-1 text-center text-sm font-medium text-white md:w-56 md:text-lg ${selectedRoom?.status === "OCCUPIED" ? "bg-primary-red" : "bg-primary-green"}`}
              >
                <p>{selectedRoom?.status}</p>
              </div>
              <div className="space-y-3">
                <p className="font-medium">Occupied By: {facultyName}</p>
                <p className="font-medium">
                  Subject & Section: {subjectAndSection ?? ""}
                </p>
                <p className="font-medium">Timed In At: {timeInAt ?? ""}</p>
                <p className="font-medium">
                  Scheduled out at: {timeOutAt ?? ""}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center border-t border-primary-green md:border-l md:border-t-0 md:pl-10">
            <p className="hidden justify-center text-center text-lg font-semibold md:flex">
              {format(currentDate, "EEEE")} Schedule
            </p>

            <div className="mt-5 space-y-5">
              {roomSchedule.map((item) => {
                return (
                  <div key={item.id} className="grid grid-cols-2">
                    <p>{item.facultyName}</p>
                    <div className="grid grid-cols-2">
                      <p>{formatTimetoLocal(item.beginTime)}</p>
                      <p>{formatTimetoLocal(item.endTime)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
