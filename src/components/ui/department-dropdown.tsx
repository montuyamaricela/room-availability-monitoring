/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import * as React from "react";

import { cn } from "./../../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ArrowUpDownIcon, CheckIcon } from "lucide-react";

export function DepartmentDropdown({
  data,
  setDropdownValue,
}: {
  data: { label: string; value: string }[];
  setDropdownValue: (dept: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between sm:w-[200px]"
        >
          {value
            ? data.find(
                (item: { label: string; value: string }) =>
                  item.label === value,
              )?.label
            : "Select..."}
          <ArrowUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 sm:w-[200px]">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data.map((item: { label: string; value: string }) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setDropdownValue(currentValue);
                    setValue(item.label);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.label ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export const departments = [
  { label: "All", value: "" },
  { label: "IE", value: "IE" },
  { label: "CE", value: "CE" },
  { label: "CIT", value: "CIT" },
  { label: "CICS", value: "CICS" },
  { label: "BA", value: "BA" },
  { label: "COED", value: "COED" },
  { label: "LSS", value: "LSS" },
];

export const days = [
  { label: "All", value: "" },
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
];

export const feedBackStatus = [
  { label: "All", value: "" },
  { label: "Acknowledged", value: "Acknowledged" },
  { label: "Unread", value: "False" },
];
