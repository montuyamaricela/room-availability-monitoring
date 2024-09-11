import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const RoomSchema = z.object({
  Capacity: z.number().min(1, "Capacity name is required"),
  ElectricFan: z.number(),
  AvailableComputers: z.number(),
  Functioning: z.number(),
  NonFunctioning: z.number(),
  Disabled: z.boolean(),
  Lecture: z.boolean(),
  Laboratory: z.boolean(),
  Airconditioned: z.boolean(),
  WithTv: z.boolean(),
});
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
};
