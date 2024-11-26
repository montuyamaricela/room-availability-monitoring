/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Table, { type TableColumn } from "./Table";
import { type facultyAttributes } from "~/data/models/schedule";
import { Container } from "../Container";
import { Label } from "~/components/ui/label";
import { DepartmentDropdown } from "~/components/ui/department-dropdown";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import FacultyDetailsModal from "../Modal/FacultyDetailsModal";
import AddFacultyModal from "../Modal/AddFacultyModal";

type exportRoomLogsProps = {
  loading: boolean;
  faculties: {
    id: number;
    facultyName: string;
    department: string;
    email: string;
  }[];
};

export default function FacultyList({
  loading,
  faculties,
}: exportRoomLogsProps) {
  const [department, setDepartment] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [faculty, setFaculty] = useState<facultyAttributes[]>(faculties);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFaculty, setSelectedFaculty] =
    useState<facultyAttributes>();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  const totalRecords = faculty?.length ?? 0;
  const pageCount = Math.ceil(totalRecords / pageSize);

  const paginatedRecords =
    faculty?.slice((page - 1) * pageSize, page * pageSize) ?? 0;

  const filteredDepartment = Array.from(
    new Set(
      faculties
        ?.map((item) => item.department)
        .filter(
          (department) => department !== null && department !== undefined,
        ),
    ),
  ).map((department) => ({ department }));

  const departments =
    filteredDepartment?.map((item) => {
      return { label: item?.department ?? "", value: item?.department ?? "" };
    }) || [];
  departments.unshift({ label: "All", value: "" });

  useEffect(() => {
    let filteredData = faculties;

    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.facultyName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (department) {
      filteredData = filteredData.filter((item) => {
        return item.department === department;
      });
    }
    setFaculty(filteredData);
  }, [department, faculties, searchQuery]);

  const columns: TableColumn<facultyAttributes>[] = [
    {
      id: "ID",
      header: "ID",
      formatter: (row) => <span>{row.id}</span>,
    },
    {
      id: "Faculty Name",
      header: "Faculty Name",
      formatter: (row) => <span>{row.facultyName}</span>,
    },
    {
      id: "Department",
      header: "Department",
      formatter: (row) => <span>{row.department}</span>,
    },
    {
      id: "Email",
      header: "Email",
      formatter: (row) => <span>{row.email}</span>,
    },
    {
      id: "Action",
      header: "Action",
      formatter: (row) => (
        <span>
          <span className="">
            <Button
                onClick={() => openModal(row.id)}
              className="bg-primary-green px-8 hover:bg-primary-green"
            >
              View
            </Button>
          </span>
        </span>
      ),
    },
  ];


  const openModal = (id: number) => {
    const selectedFaculty = faculty.find((item) => item.id === id);
    setSelectedFaculty(selectedFaculty);
    setOpen(true); // Open the modal
  };

  return (
    <Container> 
      <FacultyDetailsModal
        setOpen={setOpen}
        open={open}
        selectedFaculty={selectedFaculty}
      />
      <div className="w-full rounded border border-gray-light p-8 shadow-md drop-shadow-md">
        <p className="mb-5 text-xl font-semibold text-gray-dark">Faculty</p>
        <div className="mb-5 flex flex-col gap-5 lg:flex-row items-end">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex flex-col gap-2">
              <Label>Department: </Label>
              <DepartmentDropdown
                data={departments}
                setDropdownValue={setDepartment}
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-end justify-between gap-5 sm:flex-row">
            <div className="flex w-full flex-col gap-2">
              <Label>Search: </Label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                id="search"
                className="lg:w-96"
                placeholder="Search faculty..."
              />
            </div>
          </div>
          <AddFacultyModal />
        </div>

        <div>
          <Table<facultyAttributes>
            loading={loading}
            columns={columns}
            records={paginatedRecords}
            pagination={{
              page,
              pageSize,
              pageCount,
              total: totalRecords,
            }}
            onChangePage={(page) => setPage(page)}
          />
        </div>
      </div>
    </Container>
  );
}
