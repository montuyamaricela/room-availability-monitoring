"use client";
import React, { useState } from "react";
import { Container } from "./Container";
import { ComboboxDemo } from "../ui/dropdown";
import { Legends } from "../common/Legends";
import { RoomLayout } from "../common/Room";
import { useFilterStore } from "~/store/useFilterStore";

import PendingKeyModal from "./Modal/PendingKeyModal";
import { PENDINGKEY } from "./FacultyRoomDetails";
import { useSession } from "next-auth/react";
import { DepartmentDropdown, LaboratoryType } from "../ui/department-dropdown";
export default function Map() {
  const session = useSession();
  const { filters, toggleFilter } = useFilterStore();
  const [open, setOpen] = useState(false);
  const [selectedLaboratoryType, setSelectedLaboratoryType] = useState("");
  return (
    <Container className="relative text-black">
      <div className="flex flex-col-reverse justify-between gap-3 md:flex-row md:items-center md:gap-0">
        <div className="flex-col  gap-5 md:flex">
          <div className="flex items-center gap-5">
            <p className="font-semibold">FILTER: </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm font-medium md:mt-0 md:flex">
              {filterTabs.map((item) => (
                <div
                  onClick={() => toggleFilter(item.id)}
                  key={item.id}
                  className={`cursor-pointer rounded-full px-3 py-2 transition-all duration-700 ease-in-out md:py-1 ${
                    filters.includes(item.id)
                      ? "border-2 border-[#73AED8] bg-secondary-filtered text-white"
                      : "border-2 bg-secondary-light_gray"
                  }`}
                >
                  <p className="text-center text-sm md:text-base">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {filters.includes("isLaboratory") && (
            <div className="flex items-center gap-5">
              <p className="font-semibold">Laboratory Type: </p>

              <DepartmentDropdown
                data={LaboratoryType}
                setDropdownValue={setSelectedLaboratoryType}
              />
            </div>
          )}
        </div>
        <div className="ml-auto">
          <ComboboxDemo />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-5 overflow-auto sm:flex-row">
        <Legends />
        <RoomLayout selectedLaboratoryType={selectedLaboratoryType} />
      </div>
      {session.status === "authenticated" && (
        <>
          <div className="fixed bottom-10 right-20">
            <button
              onClick={() => setOpen(true)}
              className="bg-transparent hover:bg-transparent"
            >
              <PENDINGKEY />
            </button>
          </div>
          <PendingKeyModal setOpen={setOpen} open={open} />
        </>
      )}
    </Container>
  );
}

const filterTabs = [
  { id: "isAirconed", name: "Airconditioned" },
  { id: "withTv", name: "With TV" },
  { id: "isLaboratory", name: "Laboratory" },
  { id: "isLecture", name: "Lecture" },
];
