import React from "react";

export function Legends() {
  return (
    <div className="mt-10 space-y-2">
      {legends.map((item) => {
        return (
          <div key={item.id} className="flex items-center gap-5">
            <div className={`h-5 w-5 bg-${item.color}`} />
            <p className="font-medium">{item.title}</p>
          </div>
        );
      })}
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
    title: "Other",
  },
  {
    id: 4,
    color: "secondary-filtered",
    title: "Filtered",
  },
];
