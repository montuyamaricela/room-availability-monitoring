import React, { useState, type ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useActivityLog } from "~/lib/createLogs";

type ModalWrapperTypes = {
  ButtonTrigger?: ReactNode;
  children: ReactNode;
  role: string | undefined;
  name: string;
  userId: string | undefined;
  feedbackID: number;
  isAcknowledged: boolean;
};

const ClickedFeedback = ({
  ButtonTrigger,
  feedbackID,
  children,
  role,
  userId,
  name,
  isAcknowledged,
}: ModalWrapperTypes) => {
  const { logActivity } = useActivityLog();
  const [loading, setIsLoading] = useState(false);

  const acknowledgeFeedback = api.feedback.acknowledgeFeedback.useMutation({
    onSuccess: () => {
      toast.success("Feedback successfully acknowledged.");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error fetching user status:", error);
      setIsLoading(false);
    },
  });

  const buttonHandler = async () => {
    setIsLoading(true);
    acknowledgeFeedback.mutate({
      id: feedbackID,
      acknowledged: true,
      acknowledgedBy: name,
    });
    logActivity(userId ?? "", `acknowledged a feedback`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{ButtonTrigger}</DialogTrigger>
      <DialogContent className="md:max-w-4/5 w-[90%] bg-custom-gray">
        <div className="p-5">
          <div className="rounded-2xl border-2 border-gray-light bg-white px-3 py-7">
            {children}
          </div>
          <div className="mt-5 flex justify-center gap-5">
            <DialogClose asChild>
              <Button className="w-32">CLOSE</Button>
            </DialogClose>
            {!isAcknowledged ||
              (role === "Admin" && (
                <Button
                  onClick={buttonHandler}
                  className="w-32 bg-primary-green hover:bg-green-light"
                >
                  {loading ? "ACKNOWLEDGING..." : "ACKNOWLEDGE"}
                </Button>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClickedFeedback;
