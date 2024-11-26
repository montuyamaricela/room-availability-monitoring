/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import RoomLogsForm from "../forms/RoomLogsForm";
import * as scheduleSchema from "../../validations/ScheduleSchema";
import { api } from "~/trpc/react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import ScheduleTable from "./ScheduleTable";
import TimeInConfirmation from "../common/Modal/TimeInConfirmation";
import { useRoomStore } from "~/store/useRoomStore";

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  submittedFeedbackRecords: Set<number>;
  setSubmittedFeedbackRecords: React.Dispatch<
    React.SetStateAction<Set<number>>
  >;
};

const RoomModalSecurity = ({
  ButtonTrigger,
  open,
  setOpen,
  setSubmittedFeedbackRecords,
  submittedFeedbackRecords,
}: ModalWrapperTypes) => {
  const [loading, setLoading] = useState<boolean>(true);
  const form = useForm({
    resolver: scheduleSchema.ScheduleSchemaResolver,
    defaultValues: scheduleSchema.ScheduleSchemaDefaultValues,
  });
  const { selectedRoom } = useRoomStore();
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  const { data, isLoading, error, refetch } =
    api.schedule.getAllFaculty.useQuery();

  const filteredFaculties = Array.from(
    new Set(data?.map((faculty) => faculty.facultyName)),
  ).map((facultyName) => ({ facultyName }));

  const faculties =
    filteredFaculties?.map((item) => {
      return { label: item.facultyName, value: item.facultyName };
    }) || [];

  faculties.push({ label: "Other", value: "Other" });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="max-h-[95%] max-w-[95%] overflow-y-auto md:max-w-[70%]">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-3">
          <DialogTitle className="text-center text-2xl font-medium uppercase text-white">
            Log
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 p-5 sm:h-[90%]">
          <div>
            <p className="mb-5 text-center text-2xl font-semibold">
              {" "}
              Room {selectedRoom?.roomName}
            </p>
          </div>
          <RoomLogsForm
            setIsSubmitted={setSubmitted}
            faculty={faculties ?? []}
          />

          <ScheduleTable
            setSubmittedFeedbackRecords={setSubmittedFeedbackRecords}
            submittedFeedbackRecords={submittedFeedbackRecords}
            setOpenModal={setOpen}
            setSubmitted={setSubmitted}
            isSubmitted={isSubmitted}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModalSecurity;
