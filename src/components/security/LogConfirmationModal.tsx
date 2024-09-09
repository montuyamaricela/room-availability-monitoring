import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "../ui/form";
import { FormInput } from "../ui/form-components";
import Image from "next/image";
import icon from "/public/images/icon/image.png";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type roomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function LogConfirmationModal({ open, setOpen }: roomModalProps) {
  const form = useForm({
    resolver: authSchema.CreateAccountResolver,
    defaultValues: authSchema.CreateAccountDefaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-4/5 w-[90%] px-5">
        <DialogHeader className="rounded-t-2xl pt-14">
          <DialogTitle className="text-center text-3xl font-bold text-gray-dark">
            LOG CONFIRMATION
            <p className="text-center text-base font-normal text-gray-dark">
              Please confirm the details below
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="px-10 pt-3 pb-10">
            <Form {...form}>
              <form>
                <div className="grid grid-cols-2 gap-5">
                  <FormInput form={form} name="room" label="Room" />
                  <FormInput form={form} name="startTime" label="Start Time" />
                  <FormInput form={form} name="day" label="Day" />
                  <FormInput form={form} name="endTime" label="End Time" />
                  <FormInput form={form} name="facultyName" label="Faculty Name" />
                  <div>
                    <label htmlFor="keybBorrowedBy" className="flex justify-between text-sm font-medium">
                      Key borrowed By
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Image src={icon} alt="Information" className="cursor-pointer" width={20} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                This field defaults to the faculty&apos;s name <br />
                                who borrowed the key. If a student <br />
                                borrowed the key, replace this with <br />
                                the student&apos;s name.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </label>
                    <FormInput form={form} name="keybBorrowedBy" label="" />
                  </div>
                  <FormInput form={form} name="courseCode" label="Course Code" />
                  <FormInput form={form} name="section" label="Section" />
                </div>
                <div className="flex justify-center">
                    <Button type="submit" className="w-2/6 bg-green-dark hover:bg-green-900 mt-8 ">
                      Confirm
                    </Button>
                </div>
              </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}