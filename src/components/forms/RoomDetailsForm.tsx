/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// import { Form } from "../ui/form";
// import { FormCheckbox, FormInput } from "../ui/form-components";
// import { Button } from "../ui/button";
// import { useForm } from "react-hook-form";
// import * as roomSchema from "../../validations/roomSchema";
// import { useRoomStore } from "~/store/useRoomStore";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function RoomDetailsForm() {
//   const form = useForm<roomSchema.IRoomSchema>({
//     resolver: roomSchema.RoomSchemaResolver,
//     defaultValues: roomSchema.RoomSchemaDefaultValues,
//   });

//   const { selectedRoom } = useRoomStore();
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (selectedRoom) {
//       form.setValue("Capacity", selectedRoom?.capacity ?? 0);
//       form.setValue("ElectricFan", selectedRoom?.electricFans ?? 0);
//       form.setValue(
//         "AvailableComputers",
//         (selectedRoom?.notFunctioningComputers ?? 0) +
//           (selectedRoom?.functioningComputers ?? 0),
//       );
//       form.setValue("Functioning", selectedRoom?.functioningComputers ?? 0);
//       form.setValue(
//         "NonFunctioning",
//         selectedRoom?.notFunctioningComputers ?? 0,
//       );
//       form.setValue("Disabled", selectedRoom?.disable ?? false);
//       form.setValue("Lecture", selectedRoom?.isLecture ?? false);
//       form.setValue("Laboratory", selectedRoom?.isLaboratory ?? false);
//       form.setValue("Airconditioned", selectedRoom?.isAirconed ?? false);
//       form.setValue("WithTv", selectedRoom?.withTv ?? false);
//     }
//   }, [form, selectedRoom]);

//   const onSubmit = async (data: roomSchema.IRoomSchema) => {
//     setIsLoading(true);

//     const response = await fetch("/api/rooms", {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({
//         id: selectedRoom?.id,
//         roomName: selectedRoom?.roomName,
//         ...data,
//       }),
//     });
//     const responseData = await response.json();

//     if (response.ok) {
//       toast.success("Room sucessfully updated!");
//     } else {
//       toast.error(responseData?.message || "Something went wrong");
//       console.error("Something went wrong");
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="w-full gap-3 sm:grid-cols-2 md:grid lg:grid-cols-3">
//             <FormInput
//               form={form}
//               type="number"
//               name="Capacity"
//               label="Capacity: "
//             />
//             <FormInput
//               form={form}
//               type="number"
//               name="ElectricFan"
//               label="Electric Fan: "
//             />
//             <FormInput
//               form={form}
//               type="number"
//               name="AvailableComputers"
//               disabled={true}
//               label="Available Computers: "
//             />
//             <FormInput
//               form={form}
//               type="number"
//               name="Functioning"
//               label="Functioning: "
//             />
//             <FormInput
//               form={form}
//               type="number"
//               name="NonFunctioning"
//               label="Non-Functioning: "
//             />
//           </div>
//           <div className="mt-5 flex flex-col gap-5 sm:flex-row ">
//             <FormCheckbox form={form} name="Disable" label="Disable" />
//             <FormCheckbox
//               form={form}
//               type="checkbox"
//               name="Lecture"
//               label="Lecture"
//             />
//             <FormCheckbox
//               form={form}
//               type="checkbox"
//               name="Laboratory"
//               label="Laboratory"
//             />
//             <FormCheckbox
//               form={form}
//               type="checkbox"
//               name="Airconditioned"
//               label="Airconditioned"
//             />{" "}
//             <FormCheckbox
//               form={form}
//               type="checkbox"
//               name="WithTv"
//               label="With TV"
//             />
//           </div>
//           <div className="my-6 flex justify-center">
//             <div>
//               <Button className="bg-green-light px-10 hover:bg-primary-green">
//                 {isLoading ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }

import { Form } from "../ui/form";
import { FormCheckbox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as roomSchema from "../../validations/roomSchema";
import { useRoomStore } from "~/store/useRoomStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RoomDetailsForm() {
  const form = useForm<roomSchema.IRoomSchema>({
    resolver: roomSchema.RoomSchemaResolver,
    defaultValues: roomSchema.RoomSchemaDefaultValues,
  });

  const { selectedRoom } = useRoomStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedRoom) {
      form.setValue("Capacity", selectedRoom?.capacity ?? 0);
      form.setValue("ElectricFan", selectedRoom?.electricFans ?? 0);
      form.setValue(
        "AvailableComputers",
        (selectedRoom?.notFunctioningComputers ?? 0) +
          (selectedRoom?.functioningComputers ?? 0),
      );
      form.setValue("Functioning", selectedRoom?.functioningComputers ?? 0);
      form.setValue(
        "NonFunctioning",
        selectedRoom?.notFunctioningComputers ?? 0,
      );
      form.setValue("Disabled", selectedRoom?.disable ?? false);
      form.setValue("Lecture", selectedRoom?.isLecture ?? false);
      form.setValue("Laboratory", selectedRoom?.isLaboratory ?? false);
      form.setValue("Airconditioned", selectedRoom?.isAirconed ?? false);
      form.setValue("WithTv", selectedRoom?.withTv ?? false);
    }
  }, [form, selectedRoom]);

  useEffect(() => {
    const functioning = form.watch("Functioning");
    const nonFunctioning = form.watch("NonFunctioning");
    const functioningValue = Number(functioning) || 0; // Default to 0 if NaN
    const nonFunctioningValue = Number(nonFunctioning) || 0; // Default to 0 if NaN

    const availableComputers = functioningValue + nonFunctioningValue;

    form.setValue("AvailableComputers", availableComputers);
  }, [form.getValues("Functioning"), form.getValues("NonFunctioning")]);

  useEffect(() => {
    const lectureChecked = form.getValues("Lecture");

    if (lectureChecked) {
      form.setValue("Laboratory", false);
      form.setValue("Functioning", 0);
      form.setValue("NonFunctioning", 0);
    }
  }, [form.getValues("Lecture")]);

  useEffect(() => {
    const laboratoryChecked = form.getValues("Laboratory");

    if (laboratoryChecked) {
      form.setValue("Lecture", false);
    }
  }, [form.getValues("Laboratory")]);

  const onSubmit = async (data: roomSchema.IRoomSchema) => {
    setIsLoading(true);

    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: selectedRoom?.id,
        roomName: selectedRoom?.roomName,
        ...data,
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      toast.success("Room successfully updated!");
    } else {
      toast.error(responseData?.message || "Something went wrong");
      console.error("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full gap-3 sm:grid-cols-2 md:grid lg:grid-cols-3">
            <FormInput
              form={form}
              type="number"
              name="Capacity"
              label="Capacity: "
            />
            <FormInput
              form={form}
              type="number"
              name="ElectricFan"
              label="Electric Fan: "
            />
            <FormInput
              form={form}
              type="number"
              name="AvailableComputers"
              disabled={true}
              label="Available Computers: "
            />
            {/* Conditional rendering of Functioning and Non-Functioning based on Lecture checkbox */}
            <FormInput
              form={form}
              type="number"
              name="Functioning"
              label="Functioning: "
              disabled={form.watch("Lecture") || !form.watch("Laboratory")}
            />
            <FormInput
              form={form}
              type="number"
              name="NonFunctioning"
              label="Non-Functioning: "
              disabled={form.watch("Lecture") || !form.watch("Laboratory")}
            />
          </div>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row">
            <FormCheckbox form={form} name="Disable" label="Disable" />
            <FormCheckbox
              form={form}
              type="checkbox"
              name="Lecture"
              label="Lecture"
            />
            <FormCheckbox
              form={form}
              type="checkbox"
              name="Laboratory"
              label="Laboratory"
            />
            <FormCheckbox
              form={form}
              type="checkbox"
              name="Airconditioned"
              label="Airconditioned"
            />
            <FormCheckbox
              form={form}
              type="checkbox"
              name="WithTv"
              label="With TV"
            />
          </div>
          <div className="my-6 flex justify-end">
            <div>
              <Button className="bg-green-light px-10 hover:bg-primary-green">
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
