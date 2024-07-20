import { Container } from "../common/Container";
import { Button } from "../ui/button";

const FeedBack = [
  { id: 1, 
    dateTime: "05-05-24  11:49 AM", 
    message:"Some of the computers in the lab 1 is not working.", 
    status: "unread" 
  },
  { id: 2, 
    dateTime: "04-26-24  11:49 AM", 
    message:"1 electric fan in room 123 overheated.", 
    status: "unread" 
  },
  { id: 3, 
    dateTime: "04-26-24  11:49 AM", 
    message:"1 electric fan in room 123 overheated.", 
    status: "unread" 
  },
  { id: 4, 
    dateTime: "05-05-24  11:49 AM", 
    message:"Some of the computers in the lab 1 is not working.", 
    status: "read" 
  },
  { id: 5, 
    dateTime: "04-26-24  11:49 AM", 
    message:"1 electric fan in room 123 overheated.", 
    status: "read" 
  },
  { id: 6, 
    dateTime: "04-26-24  11:49 AM", 
    message:"1 electric fan in room 123 overheated.", 
    status: "read" 
  },
];

export default function FeedBacks() {
  const unreadFeedbacks = FeedBack.filter(feedback => feedback.status === 'unread');
  const readFeedbacks = FeedBack.filter(feedback => feedback.status === 'read');
  return (
    <Container>
      <div className="flex justify-center items-center mb-5">
        <div className="lg:w-4/6 md:w-5/6 w-full">
          <p className="text-gray-dark font-semibold text-2xl">Feedback</p>
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <div className="bg-custom-gray rounded shadow-lg drop-shadow-md lg:w-4/6 md:w-5/6 w-full p-10">
            <div>
              <p className="text-gray-dark font-semibold">Unread</p>
              {unreadFeedbacks.map(feedback => (
                <div key={feedback.id} className="flex gap-5 bg-white border border-gray-light border-1 px-5 py-3 font-semibold">
                  <input type="checkbox" name="read" />
                  <div className="flex-1">
                  <p className="text-sm text-gray-dark font-semibold mb-1">Feedback</p>
                    <p className="text-sm text-gray-dark">{feedback.message}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-gray-dark text-right">{feedback.dateTime}</p>
                  </div>
                </div>
              ))}
              <p className="text-gray-dark font-semibold mt-5">Read</p>
              {readFeedbacks.map(feedback => (
                <div key={feedback.id} className="flex gap-5 bg-white border border-gray-light border-1 px-5 py-3">
                  <input type="checkbox" name="read" />
                  <div className="flex-1">
                  <p className="text-sm text-gray-dark font-semibold mb-1">Feedback</p>
                    <p className="text-sm text-gray-dark">{feedback.message}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-gray-dark text-right">{feedback.dateTime}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </Container>
  );
}