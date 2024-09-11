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
import { type BuildingName } from "../rooms/getBuildingComponent";
import { useBuildingStore } from "~/store/useBuildingStore";

export function ComboboxDemo() {
  const { selectedBuilding, setSelectedBuilding } = useBuildingStore();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<BuildingName>(selectedBuilding);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? buildingsList.find((building) => building.value === value)?.label
            : "Select Building..."}
          <ArrowUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Building..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {buildingsList.map((building) => (
                <CommandItem
                  key={building.value}
                  value={building.value}
                  onSelect={(currentValue) => {
                    setSelectedBuilding(currentValue as BuildingName);
                    setValue(currentValue as BuildingName);
                    setOpen(false);
                  }}
                >
                  {building.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === building.value ? "opacity-100" : "opacity-0",
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
const buildingsList = [
  {
    value: "PANCHO_HALL",
    label: "Pancho Hall",
  },
  {
    value: "BSBA",
    label: "CBA Building",
  },
  {
    value: "HANGAR",
    label: "Hangar",
  },
  {
    value: "MPG_OLDCANTEEN",
    label: "Mpg & Old Canteen",
  },
];
