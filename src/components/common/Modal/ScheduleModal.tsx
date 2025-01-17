/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type scheduleAttributes } from "~/data/models/schedule";
import * as Schedule from "../../../validations/ScheduleSchema";
import { Form } from "../../ui/form";
import { FormCombobox, FormInput } from "../../ui/form-components";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import DeleteConfirmation from "../Modal/DeleteConfirmation";
import { day, time } from "~/data/models/data";
import {
  filterTimeSlots,
  formatTimetoLocal,
  generateTimeSlots,
} from "~/lib/timeSchedule";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useScheduleStore } from "~/store/useScheduleStore";
import { useActivityLog } from "~/lib/createLogs";
import { useSession } from "next-auth/react";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedSchedule: scheduleAttributes | undefined;
};

export default function ScheduleModal({
  open,
  setOpen,
  selectedSchedule,
}: roomModalProps) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { clearSchedule, schedule } = useScheduleStore();
  const { logActivity } = useActivityLog();
  const [availableSlots, setAvailableSlots] = useState([
    {
      label: "",
      value: "",
    },
  ]);
  const form = useForm({
    resolver: Schedule.ScheduleSchemaResolver,
    defaultValues: Schedule.ScheduleSchemaDefaultValues,
  });

  const onSubmit = async (data: Schedule.IScheduleSchema) => {
    setIsLoading(true);
    const response = await fetch("/api/room-schedule", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        scheduleID: selectedSchedule?.id,
        roomId: selectedSchedule?.roomId,
        roomName: selectedSchedule?.room.roomName,
        isTemp: false,
        action: "Update Schedule",
        ...data,
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      toast.success(responseData?.message);
      logActivity(
        session.data?.user.firstName + " " + session?.data?.user?.lastName ||
          "",
        `updated ${data.facultyName}'s schedule on ${selectedSchedule?.day} at Room ${selectedSchedule?.room.roomName}`,
      );
      setTimeout(() => {
        setOpen(false);
        form.reset();
      }, 1000);
    } else {
      toast.error(responseData?.error || "Something went wrong");
      console.error("Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedSchedule) {
      form.setValue("facultyName", selectedSchedule?.faculty.facultyName);
      form.setValue("Section", selectedSchedule?.section);
      form.setValue("Subject", selectedSchedule?.courseCode);
      form.setValue("Day", selectedSchedule?.day);
      form.setValue("Room", selectedSchedule?.room.roomName);
      form.setValue("beginTime", formatTimetoLocal(selectedSchedule.beginTime));
      form.setValue("endTime", formatTimetoLocal(selectedSchedule.endTime));
    }
  }, [form, selectedSchedule]);
  const { mutate: deleteUser, isPending } =
    api.schedule.deleteSchedule.useMutation({
      onSuccess: () => {
        toast.success("Successfully Deleted.");
        setOpen(false);
        if (session?.data?.user?.id) {
          logActivity(
            session.data.user.firstName + " " + session.data.user.lastName ||
              "",
            `deleted ${selectedSchedule?.faculty.facultyName}'s schedule on ${selectedSchedule?.day} in Room ${selectedSchedule?.room.roomName}`,
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDelete = (id: number) => {
    deleteUser({ id: id });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-3 ">
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Schedule
          </DialogTitle>
        </DialogHeader>
        <div className="p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3">
                <div className="col-span-3 grid grid-cols-2 gap-3">
                  <FormInput
                    form={form}
                    name="facultyName"
                    label="Faculty Name"
                    disabled
                  />
                  <FormInput form={form} name="Section" label="Section" />
                  <FormInput form={form} name="Subject" label="Subject" />
                  <FormInput form={form} name="Room" label="Room" disabled />
                </div>
                <FormCombobox
                  label="Day"
                  form={form}
                  placeholder="Select Day"
                  name={"Day"}
                  data={day}
                />

                <FormCombobox
                  label="Start time"
                  form={form}
                  placeholder="Start Time"
                  name={"beginTime"}
                  data={time}
                />
                <FormCombobox
                  label="End time"
                  form={form}
                  placeholder="End Department"
                  name={"endTime"}
                  data={time}
                />
              </div>
              <div className="mt-5 flex justify-end gap-5 ">
                <Button className="w-44 items-center bg-green-dark hover:bg-green-900 sm:w-2/6">
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <DeleteConfirmation
                  deleteHandler={() =>
                    handleDelete(selectedSchedule ? selectedSchedule?.id : 0)
                  }
                  ButtonTrigger={
                    <Button className="w-44 items-center bg-primary-red hover:bg-primary-red">
                      {isPending ? "Deleting..." : "Delete"}
                    </Button>
                  }
                />
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
