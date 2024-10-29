/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";
import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { DatePickerDemo } from "../ui/DatePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ActivityLogs from "./Table/ActivityLogs";
import RoomLogs from "./Table/RoomLogs";

export default function Logs({ loading }: Readonly<{ loading: boolean }>) {
  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full rounded border border-gray-light p-8 shadow-md drop-shadow-md">
          <p className="text-xl font-semibold text-gray-dark">LOGS</p>
          <hr className="border-t-1 mb-7 mt-1 border border-gray-light" />

          {/* will add functionalities here after the admin side */}
          {/* <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row">
            <Input
              type="text"
              id="search"
              placeholder="Search"
              className="mb-2 w-full md:mb-0 md:w-1/3"
              required
            />
            <div className="flex gap-2">
              <DatePickerDemo />
              <DatePickerDemo />
            </div>
          </div> */}

          <div>
            <Tabs defaultValue="activityLogs">
              <TabsList>
                <TabsTrigger
                  value="activityLogs"
                  className="rounded-t-2xl border-2 border-green-dark px-8 sm:px-16"
                >
                  ACTIVITY
                </TabsTrigger>
                <TabsTrigger
                  value="roomLogs"
                  className="rounded-t-2xl border-2 border-green-dark px-10 sm:px-20"
                >
                  ROOM
                </TabsTrigger>
              </TabsList>
              <RoomLogs loading={loading} />
              <ActivityLogs loading={loading} />
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
}
