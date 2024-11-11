/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";
import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { DatePickerDemo } from "../ui/DatePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ActivityLogs from "./Table/ActivityLogs";
import RoomLogs from "./Table/RoomLogs";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import ExportLogModal from "./Modal/ExportLogModal";
import { useRoomStore } from "~/store/useRoomStore";

export default function Logs({ loading }: Readonly<{ loading: boolean }>) {
  const session = useSession();
  const { rooms } = useRoomStore();
  const { data, isLoading, error, refetch } =
    api.schedule.getAllFaculty.useQuery();

  const filteredFaculties = Array.from(
    new Set(data?.map((faculty) => faculty.facultyName)),
  ).map((facultyName) => ({ facultyName }));

  const faculties =
    filteredFaculties?.map((item) => {
      return { label: item.facultyName, value: item.facultyName };
    }) || [];

  const roomIds =
    rooms.map((item) => {
      return { label: item.id, value: item.id };
    }) || [];
  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full rounded border border-gray-light p-8 shadow-md drop-shadow-md">
          <div className="mb-5 flex items-end justify-between border-b border-gray-light pb-5">
            <p className=" text-xl font-semibold text-gray-dark">LOGS</p>
            {/* <hr className="border-t-1 mb-7 mt-1 border border-gray-light" /> */}
            <ExportLogModal
              roomIds={roomIds}
              faculties={faculties}
              ButtonTrigger={
                <Button className=" mt-5 w-44 bg-primary-green text-white hover:bg-primary-green">
                  Export Room Logs
                </Button>
              }
            />
          </div>

          <div>
            <Tabs
              defaultValue={
                session.data?.user.role === "Security Guard"
                  ? "roomLogs"
                  : "activityLogs"
              }
            >
              <TabsList className="relative">
                {session.data?.user.role != "Security Guard" && (
                  <TabsTrigger
                    value="activityLogs"
                    className="rounded-t-2xl border-2 border-green-dark px-8 sm:px-16"
                  >
                    ACTIVITY LOGS
                  </TabsTrigger>
                )}

                <TabsTrigger
                  value="roomLogs"
                  className="rounded-t-2xl border-2 border-green-dark px-10 sm:px-20"
                >
                  ROOM LOGS
                </TabsTrigger>
              </TabsList>
              {session.data?.user.role != "Security Guard" && (
                <ActivityLogs loading={loading} />
              )}
              <RoomLogs loading={loading} />
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
}
