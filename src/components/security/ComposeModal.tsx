"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Form } from "../ui/form";
import { FormCombobox, FormTextarea } from "../ui/form-components";
import { departments } from "../authentications/Signup";
import { Button } from "../ui/button"
import Image from "next/image";
import icon from "/public/images/icon/add.png";
import { useForm } from "react-hook-form";
import * as authSchema from "../../validations/authValidationSchema";


export default function ComposeFeedBack() {
  const form = useForm({
    resolver: authSchema.CreateAccountResolver,
    defaultValues: authSchema.CreateAccountDefaultValues,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image src={icon} alt="Add" width={20} className="cursor-pointer"/>
      </DialogTrigger>
      <DialogContent className="md:max-w-4/5 w-[90%] p-8">
        <Form {...form}>
          <form>
            <DialogHeader>
                <div className="flex justify-center mb-4">
                    <DialogTitle>COMPOSE FEEDBACK</DialogTitle>
                </div>
            </DialogHeader>
              <div className="w-1/2">
                <p className="text-gray-dark text-md font-bold mb-4">To:</p>
                <FormCombobox
                  label="Department"
                  form={form}
                  placeholder="Select Department"
                  name={"department"}
                  data={departments}
                />
              </div>
              <div className="mt-5">
                <FormTextarea 
                  label="Message"
                  form={form}
                  name={"message"}
                />
              </div>
            <DialogFooter>
              <Button className="md:mt-0 mt-2">CANCEL</Button>
              <Button type="submit" className="bg-green-dark hover:bg-green-light">SUBMIT</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
