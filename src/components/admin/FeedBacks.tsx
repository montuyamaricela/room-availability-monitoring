import { Container } from "../common/Container";
import Image from "next/image";
import icon from "/public/images/icon/message.png";
import del from "/public/images/icon/delete.png";
import { Button } from "../ui/button";
import { FeedBack } from "../../app/SampleData";
import OpenFeedbackModal from "./ClickedFeedback";

export default function FeedBacks() {
  const unreadFeedbacks = FeedBack.filter(feedback => feedback.status === 'unread');
  const readFeedbacks = FeedBack.filter(feedback => feedback.status === 'read');
  return (
    <Container>
      <div className="flex justify-center items-center mb-5">
        <div className="flex justify-between lg:w-4/6 md:w-5/6 w-full">
          <p className="text-gray-dark font-semibold text-2xl">Feedback</p>
          <div className="flex gap-3 mr-8">
            <div>
              <Button className="bg-transparent hover:bg-green-light text-green-light hover:text-white p-1"> Acknowledge </Button>
            </div>
            <div>
              <Button className="bg-transparent hover:bg-transparent p-1">
                <Image src={icon} alt="Message" width={25}/>
              </Button>
            </div>
            <div>
              <Button className="bg-transparent hover:bg-transparent p-1">
                <Image src={del} alt="Delete" width={25}/>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <div className="bg-custom-gray rounded shadow-lg drop-shadow-md lg:w-4/6 md:w-5/6 w-full p-10">
            <div>
              <p className="text-gray-dark font-semibold">Unread</p>
              {unreadFeedbacks.map((feedback, index) => (
                <div key={index}> 
                  <OpenFeedbackModal
                    ButtonTrigger={
                      <div key={feedback.id} className="flex gap-5 bg-white border border-gray-light border-1 px-5 py-3 font-semibold cursor-pointer">
                        <input type="checkbox" name="read" />
                        <div className="flex-1">
                        <p className="text-sm text-gray-dark font-semibold mb-1">Feedback</p>
                          <p className="text-sm text-gray-dark">{feedback.message}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-xs text-gray-dark text-right">{feedback.dateTime}</p>
                        </div>
                      </div>
                    }
                  >
                    <div className="flex justify-between mb-14">
                      <p className="text-gray-dark font-semibold">Feedback</p>
                      {/* <p className="text-green-light font-semibold">Acknowledged</p> */}
                    </div>
                    <p className="mb-20">{feedback.message}</p>
                  </OpenFeedbackModal>
                </div>
                
              ))}

              <p className="text-gray-dark font-semibold mt-5">Read</p>
              {readFeedbacks.map((feedback, index) => (
                <div key={index}>
                  <OpenFeedbackModal
                    ButtonTrigger={
                      <div key={feedback.id} className="flex gap-5 bg-white border border-gray-light border-1 px-5 py-3 cursor-pointer">
                        <input type="checkbox" name="read" />
                        <div className="flex-1">
                        <p className="text-sm text-gray-dark font-semibold mb-1">Feedback</p>
                          <p className="text-sm text-gray-dark">{feedback.message}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-xs text-gray-dark text-right">{feedback.dateTime}</p>
                        </div>
                      </div>
                    }
                  >
                    <div className="flex justify-between mb-14">
                      <p className="text-gray-dark font-semibold">Feedback</p>
                    </div>
                    <p className="mb-20">{feedback.message}</p>
                  </OpenFeedbackModal>
                </div>

              ))}
            </div>
        </div>
      </div>
    </Container>
  );
}