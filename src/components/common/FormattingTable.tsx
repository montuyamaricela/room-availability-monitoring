"use client";

// import Pagination from "@/components/table/Pagination";
// import { IPagination } from "@/types/Pagination";

export interface TableColumn<T> {
  id: string;
  header: string;
  formatter?: (row: T) => JSX.Element;
}

// type RecordType = { [key: string]: any };

export interface TableProps<T> {
  loading: boolean;
  columns: TableColumn<T>[];
  records: T[];
//   pagination: IPagination;
  onChangePage: (page: number) => void;
}

const EmptyIndicator = () => {
  return <p className="text-slate-500 tracking-widest text-sm">No Results</p>;
};
const LoadingIndicator = () => {
  return <p className="text-slate-500 tracking-widest text-sm">Loading ...</p>;
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

export default function FormattingTable<T>({
  loading,
  columns,
  records,
//   pagination,
  onChangePage,
}: TableProps<T>) {
  return (
    <div className="p-4 w-full bg-white drop-shadow rounded">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <TableHeader<T> columns={columns} />

          <tbody className="divide-y divide-gray-200 bg-white">
            {loading || records.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="h-24 flex justify-center items-center">
                    {loading ? <LoadingIndicator /> : <EmptyIndicator />}
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, recordIndex) => (
                <tr key={recordIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="py-4 text-sm text-gray-500">
                      {/* {column.formatter
                        ? column.formatter(record)
                        : (record as RecordType)[column.id]} */}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* <Pagination
        loading={loading}
        pagination={pagination}
        onChange={onChangePage}
      /> */}
    </div>
  );
}