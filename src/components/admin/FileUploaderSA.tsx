/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { FormCombobox } from "../ui/form-components";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import DynamicTable, { type Header } from "../common/DynamicTable";
import { useForm } from "react-hook-form";
import * as csvSchema from "../../validations/csvDataSchema";
import { useState } from "react";
import toast from "react-hot-toast";

export default function FileUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataUploaded, setDataUploaded] = useState(null);
  const [headers, setHeaders] = useState<Header[]>([]); // Initialize with the correct type
  const [isSubmitted, setSubmitted] = useState(false);
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
        toast.success(responseData?.message);
        setDataUploaded(responseData?.data);
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
        form.reset();
      } else {
        toast.error("File upload failed");
        console.error("File upload failed");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("An error occurred during the file upload", error);
    }
  };

  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full min-w-[367px] rounded border border-gray-light p-8 shadow-md drop-shadow-md">
          <h1 className="text-2xl font-semibold text-gray-dark">
            FILE MANAGEMENT
          </h1>
          <hr className="border-t-1 mb-7 mt-1 border border-gray-light" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
                <div className="grid grid-cols-2 gap-5">
                  <div className="">
                    <h1 className="text-lg font-semibold text-gray-dark">
                      File Category
                    </h1>
                    <FormCombobox
                      label=""
                      form={form}
                      placeholder="Select File Category"
                      name="category"
                      data={category}
                    />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-lg font-semibold text-gray-dark">
                      File Attachment
                    </h1>
                    <Input
                      id="files"
                      type="file"
                      accept=".csv"
                      className="w-[100%]"
                      {...form.register("file")}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Button className="items-center bg-green-light px-10 hover:bg-green-900">
                  {isLoading ? "SUBMITTING..." : "SUBMIT"}
                </Button>
              </div>
            </form>
          </Form>
          <DynamicTable headers={headers} data={dataUploaded} />
        </div>
      </div>
    </Container>
  );
}

export const category = [
  { label: "Faculty", value: "Faculty" },
  { label: "Room", value: "Room" },
];
