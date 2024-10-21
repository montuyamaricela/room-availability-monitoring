/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Form } from "../ui/form";
import { FormCheckbox, FormInput } from "../ui/form-components";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as roomSchema from "../../validations/roomSchema";
import { useRoomStore } from "~/store/useRoomStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useActivityLog } from "~/lib/createLogs";
import { useScheduleStore } from "~/store/useScheduleStore";
import { type scheduleRecordsAttributes } from "~/data/models/schedule";
import { formatTimetoLocal } from "~/lib/timeSchedule";

export default function RoomDetailsForm() {
  const session = useSession();
  const { logActivity } = useActivityLog();
  const { scheduleRecord, schedule } = useScheduleStore();
  const [facultyName, setFacultyName] = useState<string>("");
  const [subjectAndSection, setSubjectAndSection] = useState<string>("");
  const [timeInAt, setTimeInAt] = useState<string>("");
  const [timeOutAt, setTimeOutAt] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  const form = useForm<roomSchema.IRoomSchema>({
    resolver: roomSchema.RoomSchemaResolver,
    defaultValues: roomSchema.RoomSchemaDefaultValues,
  });

  const { selectedRoom } = useRoomStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const filteredRoomScheduleRecord =
      (scheduleRecord as unknown as scheduleRecordsAttributes[]) ?? [];

    const roomSchedule = schedule.data;

    const filterSchedBySelectedRoom = filteredRoomScheduleRecord?.map(
      (item) => {
        if (
          item?.roomSchedule?.room?.roomName &&
          item.roomSchedule.room.roomName === selectedRoom?.roomName
        ) {
          if (item.timeOut === null && item.timeIn != null) {
            return item;
          }
        }
      },
    );

    const filterScheduleByFacultyAndRoom = roomSchedule?.filter((schedule) => {
      if (
        schedule.facultyName === filterSchedBySelectedRoom[0]?.facultyName &&
        schedule.room.roomName === selectedRoom?.roomName
      ) {
        if (schedule.id === filterSchedBySelectedRoom[0].roomScheduleId) {
          return schedule;
        }
      }
    });

    if (filterSchedBySelectedRoom[0]) {
      setSubjectAndSection(
        filterScheduleByFacultyAndRoom[0]?.courseCode +
          " " +
          filterScheduleByFacultyAndRoom[0]?.section || "-",
      );
      setFacultyName(filterSchedBySelectedRoom[0]?.facultyName ?? "");
      setSubjectAndSection(
        filterScheduleByFacultyAndRoom[0]?.courseCode +
          " " +
          filterScheduleByFacultyAndRoom[0]?.section || "-",
      );
      if (
        filterScheduleByFacultyAndRoom[0]?.beginTime &&
        filterScheduleByFacultyAndRoom[0]?.endTime
      ) {
        setTimeInAt(
          formatTimetoLocal(filterScheduleByFacultyAndRoom[0]?.beginTime),
        );

        setTimeOutAt(
          formatTimetoLocal(filterScheduleByFacultyAndRoom[0]?.endTime),
        );
      }
    }
  }, [scheduleRecord, selectedRoom?.roomName, schedule]);

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
      if (session?.data?.user?.id) {
        logActivity(
          session.data?.user.firstName + " " + session?.data?.user?.lastName ||
            "",
          `updated Room ${selectedRoom?.roomName} details`,
        );
      }
    } else {
      toast.error(responseData?.message || "Something went wrong");
      console.error("Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedRoom?.status === "AVAILABLE") {
      setIsAvailable(false);
      setTimeInAt(""), setTimeOutAt("");
      setFacultyName("");
      setSubjectAndSection("");
    } else {
      setIsAvailable(true);
    }
  }, [selectedRoom?.status]);

  return (
    <div className="flex w-full flex-col-reverse sm:w-auto sm:flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full gap-5 flex-col flex sm:flex-row">
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
          </div>
          <div className="w-full gap-5 mt-5 flex-col flex sm:flex-row">
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
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-5">
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
      {isAvailable && (
        <div className="mb-5 space-y-2 text-sm sm:mb-0">
          <div className="flex items-center gap-1">
            <p className="font-medium">Room status: </p>
            <div className="w-28 rounded-full bg-primary-red text-center text-sm font-medium text-white">
              <p>{selectedRoom?.status}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Occupied By: {facultyName}</p>
            <p className="font-medium">
              Subject & Section: {subjectAndSection}
            </p>
            <p className="font-medium">Timed In At: {timeInAt ?? ""}</p>
            <p className="font-medium">Scheduled out at: {timeOutAt ?? ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
