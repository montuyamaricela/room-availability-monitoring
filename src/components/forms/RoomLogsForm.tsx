import { Form } from "../ui/form";
import { FormCombobox, FormInput } from "../ui/form-components";
import {time} from "../forms/RoomAssignmentForm";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";

const getCurrentDayOfWeek = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = new Date().getDay();
    return daysOfWeek[dayIndex];
};

export default function RoomLogsForm() {
    const form = useForm({
        resolver: authSchema.CreateAccountResolver,
        defaultValues: authSchema.CreateAccountDefaultValues,
    });
    return(
        <Form {...form}>
          <form>
            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
              {/* Yung faculty name hindi ko alam kaya nag input text muna ako */}
              <FormInput form={form} name="facultyName" label="Faculty Name" />
              <FormInput form={form} name="courseCode" label="Course Code" />
              <FormInput form={form} name="section" label="Section" />
              <FormInput 
                form={form} 
                name="day" 
                label="Day"
                // setValue={getCurrentDayOfWeek()} 
                disabled 
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
          </form>
        </Form>
    )
}