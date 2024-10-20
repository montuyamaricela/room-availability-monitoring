/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import * as scheduleSchema from "../../validations/ScheduleSchema";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { useRoomStore } from "~/store/useRoomStore";
import { useScheduleStore } from "~/store/useScheduleStore";
import toast from "react-hot-toast";
import { useActivityLog } from "~/lib/createLogs";
import { day } from "~/data/models/data";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

type RoomAssignmentFormConfirmationProps = {
  userName: string;
  formData: scheduleSchema.IScheduleSchema | undefined;
  availableSlots: {
    label: string;
    value: string;
  }[];

  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RoomAssignmentFormConfirmation({
  formData,
  availableSlots,
  userName,
  open,
  setOpen,
}: RoomAssignmentFormConfirmationProps) {
  const { selectedRoom } = useRoomStore();
  const { schedule } = useScheduleStore();
  const { logActivity } = useActivityLog();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: scheduleSchema.ScheduleSchemaResolver,
    defaultValues: scheduleSchema.ScheduleSchemaDefaultValues,
  });

  useEffect(() => {
    form.setValue("Day", formData?.Day ?? "Monday");
    form.setValue("Section", formData?.Section ?? "");
    form.setValue("Subject", formData?.Subject ?? "");
    form.setValue("beginTime", formData?.beginTime ?? "");
    form.setValue("endTime", formData?.endTime ?? "");
  });

  const onSubmit = async (data: scheduleSchema.IScheduleSchema) => {
    setLoading(true);
    const response = await fetch("/api/room-schedule", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        roomId: selectedRoom?.id,
        roomName: selectedRoom?.roomName,
        isTemp: false,
        action: "Add Schedule",
        ...data,
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      toast.success(responseData?.message);
      logActivity(
        userName || "",
        `assigned schedule for ${data.facultyName} on ${data.Day} at Room ${selectedRoom?.roomName}`,
      );
    } else {
      toast.error(responseData?.error || "Something went wrong");
      console.error("Something went wrong");
    }
    setTimeout(() => {
      form.reset();
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <VisuallyHidden.Root>
          <DialogDescription>Room Modal Admin</DialogDescription>
          <DialogTitle>Room Modal Admin</DialogTitle>
        </VisuallyHidden.Root>
      </DialogHeader>
      <DialogContent className="max-w-[90%] p-10 sm:max-w-[50%]">
        <div className="mb-5 space-y-2 text-center text-gray-dark">
          <h2 className="text-4xl font-bold">Add Schedule Confirmation</h2>
          <p>Please confirm the details below</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-5 grid w-full gap-6 sm:grid-cols-3">
              <FormInput form={form} name="facultyName" label="Faculty Name" />

              <FormInput form={form} name="Subject" label="Subject" />
              <FormInput form={form} name="Section" label="Section" />
              <FormCombobox
                label="Day"
                form={form}
                placeholder="Select Day"
                name={"Day"}
                data={day}
              />
              <FormCombobox
                label="From"
                form={form}
                placeholder="Select Start Time"
                name={"beginTime"}
                data={availableSlots ?? []}
              />
              <FormCombobox
                label="To"
                form={form}
                placeholder="Select End Time"
                name={"endTime"}
                data={availableSlots ?? []}
              />
            </div>
            <div className="flex justify-end">
              <Button className=" w-44 bg-primary-green hover:bg-primary-green">
                {" "}
                {loading ? "Adding..." : "+ Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
