import { Container } from "../common/Container";
import Image from "next/image";
import icon from "/public/images/icon/message.png";
import del from "/public/images/icon/delete.png";
import { Notification } from "../../app/SampleData";
import { Button } from "../ui/button";

export default function Notifications() {
  return (
    <Container>
      <div className="flex justify-center items-center md:mb-5">
        <div className="flex  flex-col md:flex-row justify-between lg:w-4/6 w-full">
          <p className="text-gray-dark font-semibold text-2xl">Notifications</p>
          <div className="flex ml-auto gap-3">
            <div>
                <Button className="bg-transparent hover:bg-transparent p-1">
                  <Image src={icon} alt="Message" width={25}/>
                </Button>
            </div>
            <div>
              <Button className="bg-transparent hover:bg-transparent p-1">
                <Image src={del} alt="Delete" width={25} className="cursor-pointer"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <div className="bg-custom-gray rounded shadow-lg drop-shadow-md min-w-[367px] lg:w-4/6 w-full lg:p-8 p-5">
            <div>
              {Notification.map(notification => (
                <div key={notification.id} className={`flex gap-5 bg-white border border-gray-light border-1 px-4 py-4 ${notification.status === 'unread' ? 'font-semibold' : 'font-normal'}`}>
                  <input type="checkbox" name="cbNotif" />
                  <div className="flex-1 py-4">
                    <p className="text-sm text-gray-dark">{notification.message}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-gray-dark text-right sm:w-full w-[65px]">{notification.dateTime}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </Container>
  );
}