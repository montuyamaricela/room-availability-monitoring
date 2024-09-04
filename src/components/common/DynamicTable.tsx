/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

// Define the type for header objects
export interface Header {
  id: string;
  label: string;
}

export default function DynamicTable({
  headers,
  data,
}: {
  headers: Header[];
  data: any;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Determine the total number of pages
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="mt-8 space-y-2">
      <h1 className="text-lg font-semibold text-green-light">
        Uploaded File Content
      </h1>
      <div className="">
        <Table className="overflow-none">
          <TableHeader>
            <TableRow>
              {headers?.map((header: any) => (
                <TableHead key={header.id}>{header.label}</TableHead>
              ))}
              {headers.length === 0 && <TableHead>No data uploaded</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems?.map((item: any, index: number) => (
              <TableRow key={index}>
                {headers.map((header: any) => (
                  <TableCell key={header.id}>{item[header.id]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {currentItems && (
          <div className="mt-5 flex justify-end gap-5">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="items-center bg-primary-green px-5 hover:bg-primary-green"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="items-center bg-primary-green px-5 hover:bg-primary-green"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
