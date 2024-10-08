import React, { type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";

export type DeleteConfirmationTypes = {
  ButtonTrigger?: ReactNode;
  deleteHandler: () => void;
};

const DeleteConfirmation = ({
  ButtonTrigger,
  deleteHandler,
}: DeleteConfirmationTypes) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{ButtonTrigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to continue?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete and
            remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteHandler}
            className="bg-green-dark hover:bg-green-900"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;
