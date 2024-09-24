"use client";
import { Container } from "./Container";
import { ComboboxDemo } from "../ui/dropdown";
import { Legends } from "../common/Legends";
import { RoomLayout } from "../common/Room";
import { useFilterStore } from "~/store/useFilterStore";
export default function Map() {
  const { filters, toggleFilter } = useFilterStore();
  return (
    <Container className="text-black">
      <div className="flex flex-col-reverse justify-between gap-3 md:flex-row md:items-center md:gap-0">
        <div className="items-center gap-5 md:flex">
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
                <p className="text-center text-sm md:text-base">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-auto">
          <ComboboxDemo />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-5 overflow-hidden lg:flex-row">
        <Legends />
        <RoomLayout />
      </div>
    </Container>
  );
}

const filterTabs = [
  { id: "isAirconed", name: "Airconditioned" },
  { id: "withTv", name: "With TV" },
  { id: "isLaboratory", name: "Laboratory" },
  { id: "isLecture", name: "Lecture" },
];
