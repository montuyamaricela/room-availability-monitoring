import { Form } from "../ui/form";
import { FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";
import { useRoomStore } from "~/store/useRoomStore";

export default function RoomDetailsForm() {
    const form = useForm({
        resolver: authSchema.CreateAccountResolver,
        defaultValues: authSchema.CreateAccountDefaultValues,
    });
    const { selectedRoom } = useRoomStore();
    return(
        <div className="max-h-[480px] overflow-y-auto">
          <Form {...form}>
            <form>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 items-center gap-6">
                  <FormInput 
                    form={form} 
                    type="checkbox"
                    name="disable" 
                    label="Disable Room"
                    // checked={selectedRoom?.disable ? true : false}
                  />
                  <FormInput 
                    form={form} 
                    type="checkbox"
                    name="lecture" 
                    label="Lecture"
                    // checked={selectedRoom?.isLecture ? true : false}
                  />
                  <FormInput 
                    form={form} 
                    type="checkbox"
                    name="lab" 
                    label="Laboratory"
                    // checked={selectedRoom?.isLaboratory ? true : false}
                  />
                  <FormInput 
                    form={form} 
                    type="checkbox"
                    name="aircon" 
                    label="Airconditioned"
                    // checked={selectedRoom?.isAirconed ? true : false}
                  />
                  <FormInput 
                    form={form} 
                    type="checkbox"
                    name="tv" 
                    label="With TV"
                    // checked={selectedRoom?.withTv ? true : false}
                  />
                  <FormInput 
                    form={form} 
                    type="number"
                    name="capacity" 
                    label="Capacity: "
                    // setValue={selectedRoom?.capacity}
                  />
                  <FormInput 
                    form={form} 
                    type="number"
                    name="eFan" 
                    label="Electric Fan: "
                    // setValue={selectedRoom?.electricFans}
                  />
                  <FormInput 
                    form={form} 
                    type="number"
                    name="availableCom" 
                    label="Available Computers: "
                    // setValue={
                    //   selectedRoom?.notFunctioningComputers &&
                    //   selectedRoom?.notFunctioningComputers +
                    //     selectedRoom?.functioningComputers
                    // }
                  />
                  <FormInput 
                    form={form} 
                    type="number"
                    name="functional" 
                    label="Functioning: "
                    // setValue={selectedRoom?.functioningComputers}
                  />
                  <FormInput 
                    form={form} 
                    type="number"
                    name="nonFunctional" 
                    label="Non-functioning: "
                    // setValue={selectedRoom?.notFunctioningComputers}
                  />
                </div>
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