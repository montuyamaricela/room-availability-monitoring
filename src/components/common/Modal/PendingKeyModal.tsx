import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useScheduleStore } from "~/store/useScheduleStore";
import { type scheduleRecordsAttributes } from "~/data/models/schedule";
import { format } from "date-fns";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function PendingKeyModal({ open, setOpen }: roomModalProps) {
  const currentDate = new Date();

  const [pendingKeyRecords, setPendingKeyRecords] =
    useState<scheduleRecordsAttributes[]>();

  const { scheduleRecord } = useScheduleStore();
  useEffect(() => {
    const pendingRecords =
      (scheduleRecord as unknown as scheduleRecordsAttributes[]) ?? [];

    const filteredRecords = pendingRecords.filter((item) => {
      if (item.timeOut === null && item.timeIn != null) {
        if (item.roomSchedule.day === format(currentDate, "EEEE")) {
          return item;
        }
      }
    });

    setPendingKeyRecords(filteredRecords);
  }, [scheduleRecord]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-4/5 w-[90%] ">
        <DialogHeader className="rounded-t-2xl bg-[#C54F4F] py-5">
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Pending Key Returns
          </DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5 text-center text-gray-dark">
          {pendingKeyRecords && pendingKeyRecords.length > 0 ? (
            pendingKeyRecords.map((item) => (
              <div key={item.id}>
                <p className="font-semibold text-primary-green">
                  {`${item.roomSchedule.room.roomName} ${item.roomSchedule.room.building} - ${item.facultyName}`}
                </p>
              </div>
            ))
          ) : (
            <div>
              <p className="font-semibold text-primary-green">
                No Pending Key Returns
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
