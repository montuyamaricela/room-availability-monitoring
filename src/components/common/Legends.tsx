import React from "react";

export function Legends() {
  return (
    <div className="space-y-2">
      <div className=" border-2 border-primary-gray py-5">
        <div className="mx-3 mb-5 border-b-2 border-primary-gray">
          <p className="pb-2 text-center text-base font-medium text-primary-gray">
            Legend
          </p>
        </div>
        <div className="space-y-2 px-5">
          {legends.map((item) => {
            return (
              <div key={item.id} className="flex items-center gap-3 ">
                <div className={`h-5 w-5 bg-${item.color}`} />
                <p className="font-medium text-primary-gray">{item.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden">
        <div className={`h-5 w-5 bg-secondary-available`} />
        <div className={`h-5 w-5 bg-secondary-occupied`} />
        <div className={`h-5 w-5 bg-secondary-other`} />
        <div className={`h-5 w-5 bg-secondary-filtered`} />
      </div>
    </div>
  );
}

const legends = [
  {
    id: 1,
    color: "secondary-available",
    title: "Available",
  },
  {
    id: 2,
    color: "secondary-occupied",
    title: "Occupied",
  },
  {
    id: 3,
    color: "secondary-other",
    title: "Offices",
  },
  {
    id: 4,
    color: "secondary-filtered",
    title: "Filtered Selection",
  },
];
