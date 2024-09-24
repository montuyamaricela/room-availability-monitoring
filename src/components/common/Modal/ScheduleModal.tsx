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
import { formatTimetoLocal } from "~/lib/timeSchedule";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useScheduleStore } from "~/store/useScheduleStore";

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
  const [isLoading, setIsLoading] = useState(false);
  const { clearSchedule } = useScheduleStore();

  const form = useForm({
    resolver: Schedule.ScheduleSchemaResolver,
    defaultValues: Schedule.ScheduleSchemaDefaultValues,
  });

  const onSubmit = async (data: Schedule.IScheduleSchema) => {
    setIsLoading(true);
    // const response = await fetch("/api/invite-user", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: data.email,
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     role: data.role,
    //     department: data.department,
    //   }),
    // });
    // const responseData = await response.json();

    // if (response.ok) {
    //   // delay
    //   toast.success("Account created successfully!");
    //   setTimeout(() => {
    //     form.reset();
    //     window.location.reload(); // Hard reload the page
    //   }, 1500); // 3 seconds delay before redirecting
    // } else {
    //   toast.error(responseData?.message || "Something went wrong");
    //   console.error("Registration failed");
    // }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedSchedule) {
      form.setValue("facultyName", selectedSchedule?.facultyName);
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
                  <FormInput
                    form={form}
                    name="CourseCode"
                    label="Course Code"
                  />
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
                  defaultValue=""
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
