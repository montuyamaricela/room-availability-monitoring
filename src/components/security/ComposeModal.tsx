"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { FormCombobox, FormTextarea } from "../ui/form-components";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import * as feedbackSchema from "../../validations/feedbackSchema";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useActivityLog } from "~/lib/createLogs";
import { departmentList } from "../common/Modal/AddFacultyModal";

export default function ComposeFeedBack({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const { logActivity } = useActivityLog();
  const [loading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: feedbackSchema.FeedbackResolver,
    defaultValues: feedbackSchema.FeedbackDefaultValues,
  });

  const createFeedback = api.feedback.createFeedback.useMutation({
    onSuccess: () => {
      toast.success("Feedback successfully created.");
      setIsLoading(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error fetching user status:", error);
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: feedbackSchema.IFeedback) => {
    setIsLoading(true);
    createFeedback.mutate({
      department: data.department,
      feedback: data.feedback,
    });
    logActivity(
      firstName + " " + lastName || "",
      `created feedback for ${data.department} department`,
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center bg-primary-green text-white hover:bg-primary-green">
          <PlusIcon className="h-4 w-4" />
          <p>Compose Feedback</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-4/5 w-[90%] p-8">
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <DialogTitle>COMPOSE FEEDBACK</DialogTitle>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="">
              <FormCombobox
                label="To:"
                form={form}
                placeholder="Select Department"
                name={"department"}
                data={departmentList}
              />
            </div>
            <div className="">
              <FormTextarea
                label="Feedback Message"
                form={form}
                name={"feedback"}
              />
            </div>
            <DialogFooter className="flex flex-row justify-end gap-5">
              <DialogClose asChild>
                <Button className="">CANCEL</Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary-green hover:bg-primary-green"
              >
                {loading ? "SUBMITTING..." : "SUBMIT"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
