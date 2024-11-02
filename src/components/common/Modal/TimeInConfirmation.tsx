/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { type scheduleAttributes } from "~/data/models/schedule";
import { Form } from "~/components/ui/form";
import { FormInput } from "~/components/ui/form-components";
import { useForm } from "react-hook-form";
import * as scheduleSchema from "../../../validations/ScheduleSchema";
import { Button } from "~/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { formatTimetoLocal } from "~/lib/timeSchedule";
import toast from "react-hot-toast";
import { useRoomLog } from "~/lib/createLogs";
import { useSession } from "next-auth/react";
import { useTimeIn } from "~/lib/roomScheduleLog";
import  {TooltipInformation} from "../TooltipInformation";

type TimeInConfirmationProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  selectedSchedule: scheduleAttributes | null;
  setOpenModal: (loading: boolean) => void;
};

export default function TimeInConfirmation({
  open,
  setOpen,
  selectedSchedule,
  setOpenModal,
}: TimeInConfirmationProps) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { logActivity } = useRoomLog();
  const { timeInRoom } = useTimeIn();

  const form = useForm({
    resolver: scheduleSchema.TimeInSchemaResolver,
    defaultValues: scheduleSchema.TimeInSchemaResolverDefaultValues,
  });

  const onSubmit = async (data: scheduleSchema.ITimeInSchema) => {
    setIsLoading(true);
    const response = await fetch("/api/room-schedule", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        roomId: selectedSchedule ? selectedSchedule.roomId : "",
        action: "Borrowed the key",
        isTemp: selectedSchedule ? selectedSchedule.isTemp : "",
        ...data,
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      toast.success("Timed in sucessfully!");
      if (selectedSchedule?.roomId) {
        logActivity(
          session?.data?.user.firstName + " " + session?.data?.user.lastName,
          "borrowed the key",
          data.careOf,
          data.facultyName,
          selectedSchedule?.roomId,
        );
        timeInRoom(selectedSchedule.id, data.facultyName);
      }

      setTimeout(() => {
        setOpen(false);
        setOpenModal(false);
      }, 2000);
    } else {
      toast.error(responseData?.message || "Something went wrong");
      console.error("Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedSchedule) {
      form.setValue("facultyName", selectedSchedule.facultyName);
      form.setValue("Room", selectedSchedule.room.roomName);
      form.setValue("Day", selectedSchedule.day);
      form.setValue("Section", selectedSchedule?.section);
      form.setValue("Subject", selectedSchedule?.courseCode);
      form.setValue("beginTime", formatTimetoLocal(selectedSchedule.beginTime));
      form.setValue("careOf", selectedSchedule.facultyName);
      form.setValue("endTime", formatTimetoLocal(selectedSchedule.endTime));
    }
  }, [form, selectedSchedule]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <VisuallyHidden.Root>
          <DialogDescription>Time in confirmation Modal</DialogDescription>
          <DialogTitle>Time in confirmation Modal</DialogTitle>
        </VisuallyHidden.Root>
        <div className="space-y-5 p-10">
          <div className="space-y-2 text-center text-gray-dark">
            <h2 className="text-4xl font-bold">Log Confirmation</h2>
            <p>Please confirm the details below</p>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-5">
                  <FormInput form={form} name="Room" label="Room" disabled />
                  <FormInput
                    form={form}
                    name="beginTime"
                    label="Start Time"
                    disabled
                  />
                  <FormInput form={form} name="Day" label="Day" disabled />
                  <FormInput
                    form={form}
                    name="endTime"
                    label="End Time"
                    disabled
                  />
                  <FormInput
                    form={form}
                    name="facultyName"
                    label="Faculty Name"
                  />
                  <div>
                    <label
                      htmlFor="keybBorrowedBy"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      Key borrowed By
                      <div>
                        <TooltipInformation>
                          <p>
                            This field defaults to the faculty&apos;s name{" "}<br />
                            who borrowed the key. If a student <br />
                            borrowed the key, replace this with <br />
                            the student&apos;s name and number <br />
                            <span className="font-medium">
                            {" "}
                            (Eg: Juan Dela Cruz - 2021200xxx).
                            </span>
                          </p>
                        </TooltipInformation>
                      </div>
                    </label>
                    <FormInput form={form} name="careOf" label="" />
                  </div>
                  <FormInput form={form} name="Subject" label="Course Code" />
                  <FormInput form={form} name="Section" label="Section" />
                </div>
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="mt-5 w-2/6 bg-green-dark hover:bg-green-900 "
                  >
                    {isLoading ? "Saving..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
