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

type PrivacyPolicyProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function PrivacyPolicy({
  open,
  setOpen,
}: PrivacyPolicyProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90%] max-w-[90%] md:max-w-[60%]">
        <VisuallyHidden.Root>
          <DialogDescription>Privacy Policy Modal</DialogDescription>
          <DialogTitle>Privacy Policy Modal</DialogTitle>
        </VisuallyHidden.Root>
        <div className="space-y-5 p-10">
          <div className="space-y-2 text-gray-dark">
            <h2 className="text-3xl text-center font-bold">PRIVACY POLICY</h2>
            
            <ScrollArea className="h-[455px] w-full text-sm rounded-md border p-4">
              <p>
                We value your privacy and are committed to protecting your personal information. 
                This website allows users to view the layout of BulSU Bustos Campus buildings 
                without logging in. However, when you create an account, we collect certain 
                personal information, including your username and login credentials.
              </p><br/>

              <p>
                <b>Data Collection:</b> <br />
                <i>For Logged-in Users:</i> We collect login details to provide access to the 
                Room Availability Monitoring System.<br/>
                <i>For Visitors:</i> No personal data is collected when viewing the campus layout.
              </p><br/>

              <p>
                <b>Data Use:</b> <br />
                Your information is used solely for managing room availability and providing secure 
                access to the system. We do not share your data with third parties without your consent, 
                except as required by law.
              </p><br/>

              <p>
                <b>Data Security:</b> <br />
                We implement reasonable security measures to protect your personal information.
              </p><br/>

              <p>
                <b>Your Rights:</b> <br />
                You have the right to access and update your personal information at any time. For 
                questions regarding your data, please contact us.
              </p><br/>       
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}