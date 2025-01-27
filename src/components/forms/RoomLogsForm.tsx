/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as scheduleSchema from "../../validations/ScheduleSchema";
import { filterTimeSlots, generateTimeSlots } from "~/lib/timeSchedule";
import { useScheduleStore } from "~/store/useScheduleStore";
import { useEffect, useState } from "react";
import { useRoomStore } from "~/store/useRoomStore";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useActivityLog, useRoomLog } from "~/lib/createLogs";
import RoomAssignmentFormConfirmation from "./RoomAssignmentFormConfirmation";

export default function RoomLogsForm({
  faculty,
  setIsSubmitted,
}: Readonly<{
  faculty: {
    label: string;
    value: string;
  }[];
  setIsSubmitted: (submitted: boolean) => void;
}>) {
  const { logActivity } = useRoomLog();
  const { logActivity: activityLog } = useActivityLog();

  const [formData, setFormData] = useState<scheduleSchema.IScheduleSchema>();
  const [openAddScheduleModal, setOpenAddScheduleModal] = useState(false);

  const session = useSession();
  const { schedule } = useScheduleStore();
  const { selectedRoom } = useRoomStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [availableSlots, setAvailableSlots] = useState([
    {
      label: "",
      value: "",
    },
  ]);
  const form = useForm({
    resolver: scheduleSchema.ScheduleSchemaResolver,
    defaultValues: scheduleSchema.ScheduleSchemaDefaultValues,
  });
  useEffect(() => {
    const timeSlots = generateTimeSlots("07:00", "20:00", 30);
    const filteredSchedule = schedule.data.filter((item) => {
      return item.room.roomName === selectedRoom?.roomName;
    });

    const schedules = filteredSchedule.map((item) => {
      return { start: item.beginTime, end: item.endTime, day: item.day };
    });

    // Get available slots
    setAvailableSlots(filterTimeSlots(timeSlots, schedules));
  }, [schedule, selectedRoom?.roomName]);

  const onSubmit = async (data: scheduleSchema.IScheduleSchema) => {
    if (data.facultyName != "Other") {
      setLoading(true);
      const response = await fetch("/api/room-schedule", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          roomId: selectedRoom?.id,
          roomName: selectedRoom?.roomName,
          action: "Added temporary schedule",
          ...data,
          isTemp: true,
        }),
      });
      const responseData = await response.json();

      if (response.ok) {
        toast.success("Schedule successfully added!");
        if (selectedRoom?.id && session?.data?.user) {
          logActivity(
            session?.data?.user.firstName + " " + session?.data?.user.lastName,
            "added temporary schedule for",
            "",
            data.facultyName,
            selectedRoom?.id,
          );
          activityLog(
            session?.data?.user.firstName +
              " " +
              session?.data?.user.lastName || "",
            `added temporary schedule for Room ${selectedRoom.roomName}`,
          );
        }
      } else {
        toast.error(responseData?.error || "Something went wrong");
        console.error("Something went wrong");
      }
      form.reset();
      setIsSubmitted(true);
      setLoading(false);
    } else {
      setOpenAddScheduleModal(true);
      setFormData(data);
    }
  };
  return (
    <>
      <RoomAssignmentFormConfirmation
        isTemp={true}
        open={openAddScheduleModal}
        setOpen={setOpenAddScheduleModal}
        action="Added temporary schedule"
        availableSlots={availableSlots}
        formData={formData ?? undefined}
        userName={
          session.data?.user.firstName + " " + session?.data?.user?.lastName
        }
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 grid grid-cols-2 items-end gap-4 sm:grid-cols-3 md:gap-4">
            <FormCombobox
              label="Faculty Name"
              form={form}
              placeholder="Select Faculty"
              name={"facultyName"}
              data={faculty}
            />
            <FormInput form={form} name="Subject" label="Subject" />
            <FormInput form={form} name="Section" label="Section" />
            <FormInput form={form} name="Day" label="Day" disabled />
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
          <Button className="w-44 bg-green-light hover:bg-primary-green">
            {loading ? "Adding..." : "+ Add"}
          </Button>
        </form>
      </Form>
    </>
  );
}
