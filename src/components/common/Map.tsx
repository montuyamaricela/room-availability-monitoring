"use client";
import { useState } from "react";
import { Container } from "./Container";
import { ComboboxDemo } from "../ui/dropdown";
import { Legends } from "../common/Legends";
import { RoomLayout } from "../common/Room";
export default function Map() {
  const [filters, setFilters] = useState<string[]>([]);

  const toggleFilter = (id: string) => {
    setFilters((prevFilters) =>
      prevFilters.includes(id)
        ? prevFilters.filter((filter) => filter !== id)
        : [...prevFilters, id],
    );
  };

  return (
    <Container className="text-black">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <p className="font-semibold">FILTER: </p>
          <div className="flex gap-2 text-sm font-medium">
            {filterTabs.map((item) => (
              <div
                onClick={() => toggleFilter(item.id)}
                key={item.id}
                className={`cursor-pointer rounded-full px-3 py-1 transition-all duration-700 ease-in-out ${
                  filters.includes(item.id)
                    ? "bg-secondary-filtered text-white"
                    : "bg-secondary-light_gray"
                }`}
              >
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <ComboboxDemo />
        </div>
      </div>
      <RoomLayout />
      <Legends />
    </Container>
  );
}

const filterTabs = [
  { id: "Airconditioned", name: "Airconditioned" },
  { id: "With-TV", name: "With TV" },
  { id: "Laboratory", name: "Laboratory" },
  { id: "Lecture", name: "Lecture" },
];
