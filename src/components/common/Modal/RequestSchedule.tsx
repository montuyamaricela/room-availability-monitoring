/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import toast from "react-hot-toast";

import { Button } from "~/components/ui/button";
import { useActivityLog } from "~/lib/createLogs";
import { useSession } from "next-auth/react";
import { Label } from "~/components/ui/label";
import { DepartmentDropdown } from "~/components/ui/department-dropdown";
import { getSchoolYears } from "~/lib/getSchoolYear";

type RequestScheduleProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RequestSchedule({
  open,
  setOpen,
}: RequestScheduleProps) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const { logActivity } = useActivityLog();
  let schoolYears: { label: string; value: string }[] = [];

  const years = getSchoolYears();

  schoolYears = years?.map((year) => {
    return {
      label: year.schoolYear,
      value: year.schoolYear,
    };
  });

  const buttonHanlder = async () => {
    setIsLoading(true);
    if (selectedSchoolYear === "" && selectedSchoolYear === "") {
      toast.error("All Fields are required. Please try again");
      setIsLoading(false);
    }

    try {
      const response = await fetch("/api/request-schedule", {
        method: "POST",
        body: JSON.stringify({
          selectedSchoolYear,
          selectedSemester,
        }),
      });
      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message);
        if (session?.data?.user?.id) {
          logActivity(
            session.data?.user.firstName +
              " " +
              session?.data?.user?.lastName || "",
            "requested schedule from Bulsu Smart Scheduling",
          );
        }
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      } else {
        toast.error(
          responseData?.error ||
            responseData?.message ||
            "Something went wrong",
        );
        console.error("Something went wrong");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error requesting schedule", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // reset state when the modal opens/close
    setSelectedSchoolYear("");
    setSelectedSemester("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <VisuallyHidden.Root>
          <DialogDescription>Time in confirmation Modal</DialogDescription>
          <DialogTitle>Time in confirmation Modal</DialogTitle>
        </VisuallyHidden.Root>
        <div className="space-y-5 p-10">
          <div className="space-y-2 text-center text-gray-dark">
            <h2 className="text-4xl font-bold">Schedule Management</h2>
            <p className="text-sm">
              Request schedule from Bulsu Smart Schedule (Website)
            </p>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label>School Year</Label>
              <DepartmentDropdown
                data={schoolYears}
                setDropdownValue={setSelectedSchoolYear}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Semester</Label>
              <DepartmentDropdown
                data={semester}
                setDropdownValue={setSelectedSemester}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={buttonHanlder}
              className=" bg-primary-green hover:bg-primary-green"
            >
              {isLoading ? "Fetching Schedule...." : "Request Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
const semester = [
  { label: "First Semester", value: "1st" },
  { label: "Second Semester", value: "2nd" },
  { label: "Mid Year", value: "mid-year" },
];
