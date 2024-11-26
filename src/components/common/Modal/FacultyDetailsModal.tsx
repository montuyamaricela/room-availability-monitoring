/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type facultyAttributes } from "~/data/models/schedule";
import * as FacultySchema from "../../../validations/facultySchema";
import { Form } from "../../ui/form";
import { FormCombobox, FormInput } from "../../ui/form-components";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import DeleteConfirmation from "../Modal/DeleteConfirmation";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useActivityLog } from "~/lib/createLogs";
import { useSession } from "next-auth/react";
import { departmentList } from "./AddFacultyModal";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFaculty: facultyAttributes | undefined;
};

export default function FacultyDetailsModal({
  open,
  setOpen,
  selectedFaculty,
}: roomModalProps) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { logActivity } = useActivityLog();

  const form = useForm({
    resolver: FacultySchema.FacultyResolver,
    defaultValues: FacultySchema.FacultyDefaultValues,
  });

  const onSubmit = async (data: FacultySchema.IFaculty) => {
    setIsLoading(true);
    if (selectedFaculty) {
      updateFaculty({
        id: selectedFaculty.id,
        facultyName: data.facultyName,
        email: data.email,
        department: data.department,
      });
    }
  };

  useEffect(() => {
    if (selectedFaculty) {
      form.setValue("facultyName", selectedFaculty?.facultyName);
      form.setValue("email", selectedFaculty?.email);
      form.setValue("department", selectedFaculty?.department);
    }
  }, [form, selectedFaculty]);
  const { mutate: deleteFaculty, isPending } =
    api.user.deleteFaculty.useMutation({
      onSuccess: () => {
        toast.success("Successfully Deleted.");
        setOpen(false);
        if (session?.data?.user?.id) {
          logActivity(
            session.data.user.firstName + " " + session.data.user.lastName ||
              "",
            `deleted ${selectedFaculty?.facultyName}'s information`,
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updateFaculty, isPending: isUpdating } =
    api.user.updateFaculty.useMutation({
      onSuccess: () => {
        toast.success(
          `Successfully updated ${selectedFaculty?.facultyName}'s information`,
        );
        setOpen(false);
        if (session?.data?.user?.id) {
          logActivity(
            session.data.user.firstName + " " + session.data.user.lastName ||
              "",
            `updated ${selectedFaculty?.facultyName}'s information`,
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDelete = (id: number) => {
    deleteFaculty({ id: id });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="rounded-t-2xl bg-primary-green py-3 ">
          <DialogTitle className="text-center text-xl font-medium uppercase text-white">
            Faculty Details
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
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
                <DeleteConfirmation
                  deleteHandler={() =>
                    handleDelete(selectedFaculty ? selectedFaculty?.id : 0)
                  }
                  ButtonTrigger={
                    <Button className="w-44 items-center bg-primary-red hover:bg-primary-red">
                      {isPending ? "Deleting..." : "Delete"}
                    </Button>
                  }
                />
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
