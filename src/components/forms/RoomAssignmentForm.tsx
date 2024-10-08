/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as scheduleSchema from "../../validations/ScheduleSchema";
import { useRoomStore } from "~/store/useRoomStore";
import { day } from "~/data/models/data";
import { useScheduleStore } from "~/store/useScheduleStore";
import { useEffect, useState } from "react";
import { filterTimeSlots, generateTimeSlots } from "~/lib/timeSchedule";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useActivityLog } from "~/lib/createLogs";

export default function RoomAssignmentForm({
  faculty,
  setDay,
}: {
  faculty: {
    label: string;
    value: string;
  }[];
  setDay: (day: string) => void;
}) {
  const { selectedRoom } = useRoomStore();
  const { schedule } = useScheduleStore();
  const { logActivity } = useActivityLog();

  const session = useSession();

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

    const availableSlots = filterTimeSlots(
      timeSlots,
      schedules,
      form.getValues("Day"),
    );
    setDay(form.getValues("Day"));
    setAvailableSlots(availableSlots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("Day"), schedule, selectedRoom?.roomName]);

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
        session?.data?.user?.id ?? "",
        `Assigned ${data.facultyName} to Room ${selectedRoom?.roomName} `,
      );
    } else {
      toast.error(responseData?.error || "Something went wrong");
      console.error("Something went wrong");
    }
    form.reset();
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-3 gap-6">
          <FormCombobox
            label="Faculty Name"
            form={form}
            placeholder="Select Faculty"
            name={"facultyName"}
            data={faculty}
          />
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
        <Button className="w-44 bg-green-light hover:bg-primary-green">
          {" "}
          {loading ? "Adding..." : "+ Add"}
        </Button>
        {/* <Button className="ml-2 bg-green-light hover:bg-primary-green">
          Update
        </Button> */}
      </form>
    </Form>
  );
}
