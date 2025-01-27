/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Form } from "../ui/form";
import { FormCheckbox, FormCombobox, FormInput } from "../ui/form-components";
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
import { TooltipInformation } from "../common/TooltipInformation";

export default function RoomDetailsForm() {
  const session = useSession();
  const { logActivity } = useActivityLog();
  const { scheduleRecord, schedule } = useScheduleStore();
  const { rooms } = useRoomStore();

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

  const filteredLabType = Array.from(
    new Set(
      rooms
        ?.map((item) => item.laboratoryType)
        .filter(
          (laboratoryType) =>
            laboratoryType !== null &&
            laboratoryType !== undefined &&
            laboratoryType !== "", // Exclude empty strings
        ),
    ),
  ).map((laboratoryType) => ({ laboratoryType }));
  const laboratoryType =
    filteredLabType?.map((item) => {
      return {
        label: item?.laboratoryType ?? "",
        value: item?.laboratoryType ?? "",
      };
    }) || [];

  laboratoryType.push({ label: "Other", value: "Other" });
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
      return filterSchedBySelectedRoom.some((item) => {
        return (
          schedule.roomId === selectedRoom?.id &&
          schedule.id === item?.roomScheduleId
        );
      });
    });


    if (filterSchedBySelectedRoom) {
      setSubjectAndSection(
        filterScheduleByFacultyAndRoom[0]?.courseCode +
          " " +
          filterScheduleByFacultyAndRoom[0]?.section || "-",
      );
      setFacultyName(filterScheduleByFacultyAndRoom[0]?.faculty?.facultyName ?? "");
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
      form.setValue("laboratoryType", selectedRoom.laboratoryType);
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
      form.setValue("laboratoryType", "");
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
    if (selectedRoom?.status == "AVAILABLE") {
      setIsAvailable(false);
      setTimeInAt(""), setTimeOutAt("");
      setFacultyName("");
      setSubjectAndSection("");
    } else if (selectedRoom?.status == "OCCUPIED") {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
      setTimeInAt(""), setTimeOutAt("");
      setFacultyName("");
      setSubjectAndSection("");
    }
  }, [selectedRoom?.status]);

  return (
    <div className="flex w-full flex-col-reverse sm:mt-5 sm:w-auto sm:flex-col md:px-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid-row grid w-full gap-5 sm:grid-cols-3">
            <FormInput
              form={form}
              type="number"
              name="Capacity"
              label="Number of Chairs: "
            />
            <div>
              <label
                htmlFor="Functioning"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Electric Fan:
                <div>
                  <TooltipInformation>
                    <p>
                      Only count the functional items <br />
                      to avoid any confusion
                    </p>
                  </TooltipInformation>
                </div>
              </label>
              <FormInput
                form={form}
                type="number"
                name="ElectricFan"
                label=""
              />
            </div>
            <div>
              <label
                htmlFor="Functioning"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Available Computers:
                <div>
                  <TooltipInformation>
                    <p>
                      Input a number if applicable,
                      <br />
                      retain the value of 0 if it&apos;s <br />
                      not a computer laboratory. <br />
                      Only count the functional items <br />
                      to avoid any confusion
                    </p>
                  </TooltipInformation>
                </div>
              </label>
              <FormInput
                form={form}
                type="number"
                name="Functioning"
                label=""
                disabled={form.watch("Lecture") || !form.watch("Laboratory")}
              />
            </div>

            <div>
              <label
                htmlFor="Functioning"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Laboratory Type
                <div>
                  <TooltipInformation>
                    <p>
                      Select a laboratory type. <br /> If none applies, choose
                      &quot;Other&quot;.
                    </p>
                  </TooltipInformation>
                </div>
              </label>

              <FormCombobox
                label=""
                form={form}
                placeholder="Select Laboratory Type"
                name={"laboratoryType"}
                data={laboratoryType}
                disabled={!form.watch("Laboratory")}
              />
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-5">
            {/* <FormCheckbox form={form} name="Disabled" label="Disable" /> */}
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
          <div className="my-8 flex justify-center">
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
