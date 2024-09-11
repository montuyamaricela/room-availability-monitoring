/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type IPagination } from "~/lib/types";

interface PaginationProps {
  loading: boolean;
  pagination: IPagination;
  onChange: (page: number) => void;
}
const Pagination = ({ loading, pagination, onChange }: PaginationProps) => {
  const hasNoPrevious = useMemo(() => pagination.page > 1, [pagination.page]);
  const hasNoNext = useMemo(
    () => pagination.page != pagination.pageCount,
    [pagination.page, pagination.pageCount],
  );

  const start = useMemo(
    () => (pagination.page - 1) * pagination.pageSize + 1,
    [pagination.page, pagination.pageSize],
  );

  const end = useMemo(
    () => Math.min(pagination.page * pagination.pageSize, pagination.total),
    [pagination.page, pagination.pageSize, pagination.total],
  );

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onChange(pagination.page - 1)}
          disabled={!hasNoPrevious}
          className={`relative inline-flex w-24 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${!hasNoPrevious ? "bg-gray-500 text-gray-700" : "bg-primary-green text-white hover:bg-primary-green hover:text-white"}`}
        >
          Previous
        </button>
        <button
          onClick={() => onChange(pagination.page + 1)}
          disabled={!hasNoNext}
          className={`relative inline-flex w-24 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${!hasNoNext ? "bg-gray-500 text-gray-700" : "bg-primary-green text-white hover:bg-primary-green hover:text-white"}`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          {!loading && !!pagination.total && (
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{start}</span> to{" "}
              <span className="font-medium">{end}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> results
            </p>
          )}
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              onClick={() => onChange(pagination.page - 1)}
              disabled={!hasNoPrevious}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>

            {[...Array(pagination.pageCount)].map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => onChange(pageIndex + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  pagination.page === pageIndex + 1
                    ? "bg-primary-green text-white"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                } focus:z-20 focus:outline-offset-0`}
              >
                {pageIndex + 1}
              </button>
            ))}
            <button
              onClick={() => onChange(pagination.page + 1)}
              disabled={!hasNoNext}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
