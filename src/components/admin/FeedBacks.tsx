import { Container } from "../common/Container";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFeedbackStore } from "~/store/useFeedbackStore";
import { type feedBackAttributes } from "~/data/models/feedback";
import { format } from "date-fns";
import { Label } from "../ui/label";
import {
  DepartmentDropdown,
  feedBackStatus,
} from "../ui/department-dropdown";
import OpenFeedbackModal from "./ClickedFeedback";
import ComposeFeedBack from "../security/ComposeModal";
import Pagination from "../common/Table/Pagination";
import { useUserInfoStore } from "~/store/useUserInfoStore";
import {  departmentList1 } from "../common/Modal/AddFacultyModal";

const pageSize = 30; // Define the number of items per page

export default function FeedBacks() {
  const session = useSession();
  const { feedbacks } = useFeedbackStore();
  const [allFeedbacks, setAllFeedbacks] = useState<feedBackAttributes[]>([]);
  const [paginatedFeedbacks, setPaginatedFeedbacks] = useState<
    feedBackAttributes[]
  >([]);
  const [department, setDepartment] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1); // Track the current page
  const [totalRecords, setTotalRecords] = useState<number>(0); // Track total feedbacks

  const { user } = useUserInfoStore();
  useEffect(() => {
    let filteredData = feedbacks?.data;
    if (session?.data?.user?.role === "Admin") {
      if (user?.department) {
        setDepartment(user?.department);
      }
    }

    if (department) {
      filteredData = filteredData.filter(
        (feedback) => feedback.department === department,
      );
    }

    if (status) {
      const statusAsBoolean = status === "Acknowledged" ? true : false;
      filteredData = filteredData.filter(
        (feedback) => feedback.acknowledged === statusAsBoolean,
      );
    }

    setAllFeedbacks(filteredData as unknown as feedBackAttributes[]);
    setTotalRecords(filteredData.length); // Set the total number of feedbacks

    // Slice the data for the current page
    const paginatedData = filteredData.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );
    setPaginatedFeedbacks(paginatedData);
  }, [feedbacks, department, status, page, user, session]);

  // Handle pagination page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container>
      <div className="mb-5 flex items-center justify-center">
        <div className="flex w-full flex-col justify-between sm:flex-row sm:items-center  lg:w-4/6">
          <p className="text-2xl font-semibold text-gray-dark">Feedback</p>
          {session.data?.user.role === "Security Guard" && (
            <div className="ml-auto flex items-center gap-3">
              <ComposeFeedBack {...session.data.user} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full min-w-[367px] rounded bg-custom-gray p-5 shadow-lg drop-shadow-md lg:w-4/6 lg:p-10">
          <div>
            <div className="mb-5 flex gap-3">
              {session.data?.user.role != "Admin" && (
                <div className="flex flex-col gap-2">
                  <Label>Department: </Label>
                  <DepartmentDropdown
                    data={departmentList1}
                    setDropdownValue={setDepartment}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label>Status: </Label>
                <DepartmentDropdown
                  data={feedBackStatus}
                  setDropdownValue={setStatus}
                />
              </div>
            </div>

            {paginatedFeedbacks.length === 0 && (
              <p className="text-center text-sm tracking-widest text-slate-500">
                No Results
              </p>
            )}

            {session &&
              paginatedFeedbacks?.map((feedback, index) => (
                <div key={index}>
                  <OpenFeedbackModal
                    role={session.data?.user.role}
                    name={
                      session?.data?.user?.firstName +
                      " " +
                      session?.data?.user.lastName
                    }
                    userName={
                      session?.data?.user.firstName +
                      " " +
                      session.data?.user.lastName
                    }
                    feedbackID={feedback.id}
                    isAcknowledged={feedback.acknowledged}
                    ButtonTrigger={
                      <div
                        key={feedback.id}
                        className="border-1 flex cursor-pointer gap-5 border border-gray-light bg-white px-5 py-3"
                      >
                        <div className="flex-1">
                          <p className="mb-1 text-sm font-semibold text-gray-dark">
                            Feedback{" "}
                            {feedback.acknowledged && (
                              <span className="ml-1 text-xs text-green-light">
                                Acknowledged
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-dark">
                            {feedback.message}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="w-[65px] text-right text-xs text-gray-dark sm:w-full">
                            {format(feedback.dateTime, "MMM dd, yyyy h:mm a")}
                          </p>
                        </div>
                      </div>
                    }
                  >
                    <div className="mb-14 flex justify-between">
                      <p className="font-semibold text-gray-dark">Feedback</p>
                    </div>
                    <p className="mb-20">{feedback.message}</p>
                  </OpenFeedbackModal>
                </div>
              ))}
          </div>

          {/* Pagination Component */}
          <Pagination
            loading={false}
            isOnFeedback={true}
            pagination={{
              page: page,
              pageSize: pageSize,
              total: totalRecords,
              pageCount: Math.ceil(totalRecords / pageSize),
            }}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </Container>
  );
}
