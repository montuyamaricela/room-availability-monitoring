import { Form } from "../ui/form";
import { FormCheckbox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as roomSchema from "../../validations/roomSchema";
import { useRoomStore } from "~/store/useRoomStore";
import { useEffect } from "react";

export default function RoomDetailsForm() {
  const form = useForm({
    resolver: roomSchema.RoomSchemaResolver,
    defaultValues: roomSchema.RoomSchemaDefaultValues,
  });
  const { selectedRoom } = useRoomStore();

  useEffect(() => {
    if (selectedRoom) {
      form.setValue("Capacity", selectedRoom?.capacity);
      form.setValue("ElectricFan", selectedRoom?.electricFans);
      form.setValue(
        "AvailableComputers",
        selectedRoom?.notFunctioningComputers +
          selectedRoom?.functioningComputers,
      );
      form.setValue("Functioning", selectedRoom?.functioningComputers);
      form.setValue("NonFunctioning", selectedRoom?.notFunctioningComputers);
      form.setValue("Disabled", selectedRoom?.disable);
      form.setValue("Lecture", selectedRoom?.isLecture);
      form.setValue("Laboratory", selectedRoom?.isLaboratory);
      form.setValue("Airconditioned", selectedRoom?.isAirconed);
      form.setValue("WithTv", selectedRoom?.withTv);
    }
  }, [form, selectedRoom]);

  return (
    <div>
      <Form {...form}>
        <form>
          <div className="w-full gap-3 sm:grid-cols-2 md:grid lg:grid-cols-3">
            <FormInput
              form={form}
              type="number"
              name="Capacity"
              label="Capacity: "
              // setValue={selectedRoom?.capacity}
            />
            <FormInput
              form={form}
              type="number"
              name="ElectricFan"
              label="Electric Fan: "
              // setValue={selectedRoom?.electricFans}
            />
            <FormInput
              form={form}
              type="number"
              name="AvailableComputers"
              disabled={true}
              label="Available Computers: "
            />
            <FormInput
              form={form}
              type="number"
              name="Functioning"
              label="Functioning: "
              // setValue={selectedRoom?.functioningComputers}
            />
            <FormInput
              form={form}
              type="number"
              name="NonFunctioning"
              label="Non-Functioning: "
              // setValue={selectedRoom?.notFunctioningComputers}
            />
          </div>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row ">
            <FormCheckbox form={form} name="Disable" label="Disable" />
            <FormCheckbox
              form={form}
              type="checkbox"
              name="Lecture"
              label="Lecture"
              // checked={selectedRoom?.isLecture ? true : false}
            />
            <FormCheckbox
              form={form}
              type="checkbox"
              name="Laboratory"
              label="Laboratory"
              // checked={selectedRoom?.isLaboratory ? true : false}
            />
            <FormCheckbox
              form={form}
              type="checkbox"
              name="Airconditioned"
              label="Airconditioned"
              // checked={selectedRoom?.isAirconed ? true : false}
            />{" "}
            <FormCheckbox
              form={form}
              type="checkbox"
              name="WithTv"
              label="With TV"
              // checked={selectedRoom?.withTv ? true : false}
            />
          </div>
          <div className="my-6 flex justify-center">
            <div>
              <Button className="bg-green-light px-10 hover:bg-primary-green">
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
