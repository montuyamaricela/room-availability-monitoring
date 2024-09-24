/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import toast from "react-hot-toast";
import * as csvSchema from "../../../validations/csvDataSchema";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form } from "~/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import icon from "/public/images/icon/image.png";
import Image from "next/image";
import { type Header } from "../DynamicTable";

type UploadScheduleModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function UploadScheduleModal({
  open,
  setOpen,
}: UploadScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [headers, setHeaders] = useState<Header[]>([]); // Initialize with the correct type

  const form = useForm({
    resolver: csvSchema.csvDataResolver,
    defaultValues: csvSchema.csvDataDefaultValues,
  });

  const onSubmit = async (data: csvSchema.IcsvData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("category", data.category);

      // Append the actual file
      if (data.file?.[0]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        formData.append("file", data?.file[0]);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData?.data.length > 0) {
          // Extract headers dynamically from the first item in the data
          const keys = Object.keys(responseData.data[0]);
          const headers = keys.map((key) => ({
            id: key,
            label:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "), // Format header labels
          }));
          setHeaders(headers);
        }
        toast.success(responseData?.message);
        form.reset();
      } else {
        toast.error("File upload failed");
        console.error("File upload failed");
      }
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("An error occurred during the file upload", error);
    }
  };
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
            <p className="text-sm">Please upload your schedule</p>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="">
                  <div className="space-y-2">
                    <label
                      htmlFor="keybBorrowedBy"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      {form?.formState?.errors?.file?.message ? (
                        <span className="text-primary-red">
                          {form?.formState?.errors?.file?.message}
                        </span>
                      ) : (
                        "Schedule"
                      )}
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Image
                                src={icon}
                                alt="Information"
                                className="cursor-pointer"
                                width={15}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs font-normal">
                              <p>
                                This field only accepts{" "}
                                <span className="font-medium">CSV format </span>
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </label>
                    <Input
                      id="files"
                      type="file"
                      accept=".csv"
                      className="w-[100%]"
                      {...form.register("file")}
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    disabled={!form.formState.isDirty}
                    className="items-center bg-primary-green px-10 hover:bg-green-900"
                  >
                    {isLoading ? "SUBMITTING..." : "SUBMIT"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
