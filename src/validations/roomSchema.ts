import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const RoomSchema = z
  .object({
    Capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    ElectricFan: z.coerce.number().min(0, "Electric Fans cannot be negative"),
    AvailableComputers: z.coerce
      .number()
      .min(0, "Available Computers cannot be negative"),
    Functioning: z.coerce
      .number()
      .min(0, "Functioning Computers cannot be negative"),
    NonFunctioning: z.coerce
      .number()
      .min(0, "Non-functioning Computers cannot be negative"),
    Disabled: z.boolean(),
    Lecture: z.boolean(),
    Laboratory: z.boolean(),
    Airconditioned: z.boolean(),
    WithTv: z.boolean(),
    laboratoryType: z.string().optional(), // This will be conditionally required
  })
  .refine((data) => data.Lecture || data.Laboratory, {
    message: "Either Lecture or Laboratory must be selected",
    path: ["Lecture", "Laboratory"], // Error message applies to both fields
  })
  .refine(
    (data) => {
      // If Laboratory is true, laboratoryType is required
      if (data.Laboratory && !data.laboratoryType) {
        return false;
      }
      return true;
    },
    {
      message: "Laboratory Type is required when Laboratory is selected",
      path: ["laboratoryType"],
    },
  );

export type IRoomSchema = z.infer<typeof RoomSchema>;
export const RoomSchemaResolver = zodResolver(RoomSchema);
export const RoomSchemaDefaultValues = {
  Capacity: 0,
  ElectricFan: 0,
  AvailableComputers: 0,
  Functioning: 0,
  NonFunctioning: 0,
  Disabled: false,
  Lecture: false,
  Laboratory: false,
  Airconditioned: false,
  WithTv: false,
  laboratoryType: "", // Default value as empty string
};
