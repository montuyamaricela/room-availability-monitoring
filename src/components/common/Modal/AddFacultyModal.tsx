/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import * as FacultySchema from "../../../validations/facultySchema";
import { Form } from "../../ui/form";
import { FormCombobox, FormInput } from "../../ui/form-components";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useActivityLog } from "~/lib/createLogs";
import { useSession } from "next-auth/react";

export default function AddFacultyModal() {
  const session = useSession();
  const { logActivity } = useActivityLog();

  const form = useForm({
    resolver: FacultySchema.FacultyResolver,
    defaultValues: FacultySchema.FacultyDefaultValues,
  });

  const onSubmit = async (data: FacultySchema.IFaculty) => {
    if (data) {
      createFaculty({
        facultyName: data.facultyName,
        email: data.email,
        department: data.department,
      });
    }
  };

  const { mutate: createFaculty, isPending: isUpdating } =
    api.user.createFaculty.useMutation({
      onSuccess: () => {
        toast.success(`Successfully added new faculty`);
        if (session?.data?.user?.id) {
          logActivity(
            session.data.user.firstName + " " + session.data.user.lastName ||
              "",
            `added new faculty`,
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-56 items-center bg-green-dark hover:bg-green-900">
          Add Faculty
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-3 ">
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Faculty
          </DialogTitle>
        </DialogHeader>
        <div className="p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3">
                <div className="col-span-3 grid grid-cols-2 gap-3">
                  <FormInput
                    form={form}
                    name="facultyName"
                    label="Faculty Name"
                  />
                  <FormCombobox
                    label="Department"
                    form={form}
                    placeholder="Select Department"
                    name={"department"}
                    data={departmentList}
                  />
                </div>

                <div className="col-span-3">
                  <FormInput form={form} name="email" label="Email Address" />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-5 ">
                <Button className="w-44 items-center bg-green-dark hover:bg-green-900 sm:w-2/6">
                  {isUpdating ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export const departmentList1 = [
  {label: "All", value: ""},
  { label: "BEED (COED)", value: "BEED (COED)" },
  { label: "BPED (COED)", value: "BPED (COED)" },
  { label: "BSBA (CBEA)", value: "BSBA (CBEA)" },
  { label: "BSCE (COE)", value: "BSCE (COE)" },
  { label: "BSCS (CICS)", value: "BSCS (CICS)" },
  { label: "BSED (COED)", value: "BSED (COED)" },
  { label: "BSEN (CBEA)", value: "BSEN (CBEA)" },
  { label: "BSIE (COE)", value: "BSIE (COE)" },
  { label: "BSIT (CICS)", value: "BSIT (CICS)" },
  { label: "BTLED (COED)", value: "BTLED (COED)" },
  { label: "CIT", value: "CIT" },
  { label: "GE (GEARD)", value: "GE (GEARD)" },
];


export const departmentList = [
  { label: "BEED (COED)", value: "BEED (COED)" },
  { label: "BPED (COED)", value: "BPED (COED)" },
  { label: "BSBA (CBEA)", value: "BSBA (CBEA)" },
  { label: "BSCE (COE)", value: "BSCE (COE)" },
  { label: "BSCS (CICS)", value: "BSCS (CICS)" },
  { label: "BSED (COED)", value: "BSED (COED)" },
  { label: "BSEN (CBEA)", value: "BSEN (CBEA)" },
  { label: "BSIE (COE)", value: "BSIE (COE)" },
  { label: "BSIT (CICS)", value: "BSIT (CICS)" },
  { label: "BTLED (COED)", value: "BTLED (COED)" },
  { label: "CIT", value: "CIT" },
  { label: "GE (GEARD)", value: "GE (GEARD)" },
];
