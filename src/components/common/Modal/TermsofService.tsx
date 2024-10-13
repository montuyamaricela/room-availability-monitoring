/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

type TermsofServiceProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function TermsofService({
  open,
  setOpen,
}: TermsofServiceProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90%] max-w-[90%] md:max-w-[60%]">
        <VisuallyHidden.Root>
          <DialogDescription>Terms of Service Modal</DialogDescription>
          <DialogTitle>Terms of Service Modal</DialogTitle>
        </VisuallyHidden.Root>
        <div className="space-y-5 p-10">
          <div className="space-y-2 text-gray-dark">
            <h2 className="text-3xl text-center font-bold">Terms of Service</h2>
            
            <ScrollArea className="h-[380px] w-full text-sm rounded-md border p-4">
              <p>
                By accessing this website, you agree to comply with the following Terms of Service:
              </p><br/>

              <p>
                <b>Use of the Site: </b>
                This site provides access to the layout of BulSU Bustos Campus buildings and requires 
                an account for additional functionalities. Users must provide accurate information when 
                creating an account.
              </p><br/>

              <p>
                <b>Account Security: </b>
                You are responsible for maintaining the confidentiality of your login credentials. Any 
                unauthorized use of your account should be reported immediately.
              </p><br/>

              <p>
                <b>Prohibited Activities: </b>
                Unauthorized access, misuse of the system, or sharing your account information is 
                prohibited and may lead to account suspension.
              </p><br/>

              <p>
                <b>Limitation of Liability: </b>
                BulSU is not liable for any direct or indirect damages arising from your use of the system.
              </p><br/>

              <p>
                <b>Changes to Terms: </b>
                We reserve the right to modify these Terms of Service at any time. Users will be notified 
                of significant changes.
              </p>  
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}