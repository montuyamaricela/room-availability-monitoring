"use client";

import { type IPagination } from "~/lib/types";
import Pagination from "./Pagination";

export interface TableColumn<T> {
  id: string;
  header: string;
  width?: number;
  formatter?: (row: T) => JSX.Element;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-indexed-object-style
type RecordType = { [key: string]: any };

export interface TableProps<T> {
  loading: boolean;
  columns: TableColumn<T>[];
  records: T[];
  pagination: IPagination;
  onChangePage: (page: number) => void;
}

const EmptyIndicator = () => {
  return <p className="text-sm tracking-widest text-slate-500">No Results</p>;
};
const LoadingIndicator = () => {
  return <p className="text-sm tracking-widest text-slate-500">Loading ...</p>;
};

function TableHeader<T>({ columns }: { columns: TableColumn<T>[] }) {
  return (
    <thead>
      <tr>
        {columns.map((item, index) => (
          <th
            key={index}
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            {item.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default function Table<T>({
  loading,
  columns,
  records,
  pagination,
  onChangePage,
}: TableProps<T>) {
  return (
    <div className="w-full rounded bg-white p-4 drop-shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <TableHeader<T> columns={columns} />

          <tbody className="divide-y divide-gray-200 bg-white">
            {loading || records.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex h-24 items-center justify-center">
                    {loading ? <LoadingIndicator /> : <EmptyIndicator />}
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, recordIndex) => (
                <tr key={recordIndex}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-4 text-left text-sm text-gray-500"
                      // width={
                      //   column.width
                      //     ? column.width
                      //     : column.id === "Action"
                      //       ? 10
                      //       : "auto"
                      // }
                    >
                      {column.formatter
                        ? column.formatter(record)
                        : (record as RecordType)[column.id]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        loading={loading}
        pagination={pagination}
        onChange={onChangePage}
      />
    </div>
  );
}
