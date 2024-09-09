import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "../ui/form";
import { FormInput, FormCombobox } from "../ui/form-components";
import { departments } from "../authentications/Signup";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function AddFacultyModal({ open, setOpen }: roomModalProps) {
  const form = useForm({
    resolver: authSchema.CreateAccountResolver,
    defaultValues: authSchema.CreateAccountDefaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-4/5 w-[90%] px-10">
        <DialogHeader className="rounded-t-2xl pt-14">
          <DialogTitle className="text-center text-3xl font-bold text-gray-dark">
            Faculty Information
            <p className="text-center text-base font-medium text-gray-dark">
                Please fill the fields below
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="px-10 pt-3 pb-10">
            <Form {...form}>
              <form>
                <FormInput form={form} name="facultyName" label="Faculty Name" /><br/>
                <FormCombobox
                 label="Department"
                 form={form}
                 placeholder="Select Department"
                 name={"department"}
                 data={departments}
                />
                <div className="flex justify-center">
                    <Button type="submit" className="w-2/6 bg-green-dark hover:bg-green-900 mt-8 ">
                        Submit
                    </Button>
                </div>
              </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}