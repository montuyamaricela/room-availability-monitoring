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
import RoomInfo from "./RoomInfo";

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


    const getTimeIn = filterSchedBySelectedRoom?.filter((schedule) => {
      console.log(schedule)
        if (schedule.facultyName === filterScheduleByFacultyAndRoom[0]?.facultyName) {
          return schedule;
          
      }
    });

    console.log(getTimeIn);
    
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
        getTimeIn[0]?.timeIn &&
        filterScheduleByFacultyAndRoom[0]?.endTime
      ) {
        setTimeInAt(
          format(getTimeIn[0]?.timeIn, "HH:mm a"),
        );
        // {format(feedback.dateTime, "MMM dd, yyyy h:mm a")}

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
      <DialogContent className="max-w-[95%] max-h-[95%] lg:max-w-[80%] overflow-auto">
        <DialogHeader
          className={`rounded-t-2xl py-5 ${selectedRoom?.status === "OCCUPIED" ? "bg-[#C54F4F]" : "bg-primary-green"}`}
        >
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Room {selectedRoom?.roomName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-5 pb-10 md:grid md:grid-cols-2 lg:px-10 ">
          <div className="mt-8">
            <RoomInfo />
            <div>
              <div className="space-y-5 sm:mb-0 border-2 border-slate-300 rounded-lg p-2">
                <div className="space-y-3">
                  <p className="font-medium">Occupied By: <span className="font-semibold">{facultyName}</span></p>
                  <p className="font-medium">
                    Subject & Section: <span className="font-semibold">{subjectAndSection ?? ""}</span>
                  </p>
                  <div className="grid grid-rows md:grid-cols-2">
                    <p className="font-medium">Timed In At: <span className="font-semibold">{timeInAt ?? ""}</span> </p>
                    <p className="font-medium mt-2 md:mt-0">
                      Scheduled out at: <span className="font-semibold">{timeOutAt ?? ""}</span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="flex justify-center mt-5 text-center text-lg font-semibold md:hidden">
                {format(currentDate, "EEEE")} Schedule
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center border-t border-primary-green md:border-l md:border-t-0 md:pl-12">
            <p className="hidden justify-center text-center text-lg font-semibold md:flex">
              {format(currentDate, "EEEE")} Schedule
            </p>

            <div className="mt-8 space-y-5">
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
