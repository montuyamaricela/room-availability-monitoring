import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as scheduleSchema from "../../validations/ScheduleSchema";
import { time } from "~/data/models/data";

export default function RoomLogsForm() {
  const form = useForm({
    resolver: scheduleSchema.ScheduleSchemaResolver,
    defaultValues: scheduleSchema.ScheduleSchemaDefaultValues,
  });

  return (
    <Form {...form}>
      <form>
        <div className="mb-5 grid grid-cols-2 items-end gap-4 sm:grid-cols-3 md:gap-4">
          {/* Yung faculty name hindi ko alam kaya nag input text muna ako */}
          <FormInput form={form} name="facultyName" label="Faculty Name" />
          <FormInput form={form} name="courseCode" label="Course Code" />
          <FormInput form={form} name="section" label="Section" />
          <FormInput form={form} name="Day" label="Day" disabled />
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
        <Button className="w-44 bg-green-light hover:bg-primary-green">
          + Add
        </Button>
      </form>
    </Form>
  );
}
