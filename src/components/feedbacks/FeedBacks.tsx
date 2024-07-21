import { Container } from "../common/Container";
import { FeedBack } from "../../app/SampleData";
import OpenFeedbackModal from "../feedbackmodal/ClickedFeedback";

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
                    <p className="text-green-light font-semibold"></p>
                  </div>
                  <p className="mb-20">{feedback.message}</p>
                </OpenFeedbackModal>
              ))}

              <p className="text-gray-dark font-semibold mt-5">Read</p>
              {readFeedbacks.map(feedback => (
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
              ))}
            </div>
        </div>
      </div>
    </Container>
  );
}