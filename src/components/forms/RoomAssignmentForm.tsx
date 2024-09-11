/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as scheduleSchema from "../../validations/ScheduleSchema";
import { useRoomStore } from "~/store/useRoomStore";
import { day, time } from "~/data/models/data";

export default function RoomAssignmentForm({
  faculty,
}: {
  faculty: {
    label: string;
    value: string;
  }[];
}) {
  const { selectedRoom } = useRoomStore();

  const form = useForm({
    resolver: scheduleSchema.ScheduleSchemaResolver,
    defaultValues: scheduleSchema.ScheduleSchemaDefaultValues,
  });

  return (
    <Form {...form}>
      <form>
        <div className="mb-5 grid grid-cols-3 gap-6">
          <FormCombobox
            label="Faculty Name"
            form={form}
            placeholder="Select Faculty"
            name={"facultyName"}
            data={faculty}
          />
          {/* <FormInput form={form} name="facultyName" label="Faculty Name" /> */}
          <FormInput form={form} name="courseCode" label="Course Code" />
          <FormInput form={form} name="section" label="Section" />
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
            name={"startTime"}
            data={time}
          />
          <FormCombobox
            label="To"
            form={form}
            placeholder="Select End Time"
            name={"endTime"}
            data={time}
          />
        </div>
        <Button className="bg-green-light hover:bg-primary-green">+ Add</Button>
        <Button className="ml-2 bg-green-light hover:bg-primary-green">
          Update
        </Button>
      </form>
    </Form>
  );
}
