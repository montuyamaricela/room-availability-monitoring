import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";

export default function RoomAssignmentForm() {
    const form = useForm({
        resolver: authSchema.CreateAccountResolver,
        defaultValues: authSchema.CreateAccountDefaultValues,
    });
    return(
        <Form {...form}>
          <form>
            <div className="mb-5 grid grid-cols-3 gap-6">
              <FormInput form={form} name="facultyName" label="Faculty Name" />
              <FormInput form={form} name="courseCode" label="Course Code" />
              <FormInput form={form} name="section" label="Section" />
              <FormCombobox
                label="Day"
                form={form}
                placeholder="Select Day"
                name={"day"}
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
            <Button className="bg-green-light hover:bg-primary-green">
                + Add
            </Button>
            <Button className="ml-2 bg-green-light hover:bg-primary-green">
                Update
            </Button>
          </form>
        </Form>
    );
}

export const day = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
];

export const time = [
    { label: "7:00 AM", value: "7:00 AM" },
    { label: "7:30 AM", value: "7:30 AM" },
    { label: "8:00 AM", value: "8:00 AM" },
    { label: "8:30 AM", value: "8:30 AM" },
    { label: "9:00 AM", value: "9:00 AM" },
    { label: "9:30 AM", value: "9:30 AM" },
    { label: "10:00 AM", value: "10:00 AM" },
    { label: "10:30 AM", value: "10:30 AM" },
    { label: "11:00 AM", value: "11:00 AM" },
    { label: "11:30 AM", value: "11:30 AM" },
    { label: "12:00 PM", value: "12:00 PM" },
    { label: "12:30 PM", value: "12:30 PM" },
    { label: "1:00 PM", value: "1:00 PM" },
    { label: "1:30 PM", value: "1:30 PM" },
    { label: "2:00 PM", value: "2:00 PM" },
    { label: "2:30 PM", value: "2:30 PM" },
    { label: "3:00 PM", value: "3:00 PM" },
    { label: "3:30 PM", value: "3:30 PM" },
    { label: "4:00 PM", value: "4:00 PM" },
    { label: "4:30 PM", value: "4:30 PM" },
    { label: "5:00 PM", value: "5:00 PM" },
    { label: "5:30 PM", value: "5:30 PM" },
    { label: "6:00 PM", value: "6:00 PM" },
    { label: "6:30 PM", value: "6:30 PM" },
    { label: "7:00 PM", value: "7:00 PM" },
    { label: "7:30 PM", value: "7:30 PM" },
    { label: "8:00 PM", value: "8:00 PM" },
];