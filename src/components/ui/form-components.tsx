/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type FieldProps } from "../../lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

export const FormInput = ({
  form,
  name,
  type,
  label,
  description,
  onChange,
  defaultValue,
  disabled,
  placeholder,
}: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full flex-col space-y-2 ">
            <FormLabel className="text-sm leading-[14px]">{label}</FormLabel>
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled ?? false}
                {...field}
                className={type == "checkbox" ? "h-4 w-full" : ""}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        );
      }}
    />
  );
};

export const FormTextarea = ({
  form,
  name,
  label,
  description,
  placeholder,
  onChange,
}: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea placeholder={placeholder} rows={3} {...field} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export const FormCombobox = ({
  form,
  name,
  label,
  data,
  description,
  disabled,
  placeholder,
}: FieldProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled ?? data?.length === 0}
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? data?.find((item) => item.value === field.value)?.label
                      : placeholder ?? "Select an option"}
                    {/* <CaretSortIcon className="w-4 h-4 ml-2 -mr-2 opacity-50 shrink-0" /> */}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search..." className="h-9" />
                  <CommandEmpty>Not found...</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {data?.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue(name, item.value);
                            setOpen(false);
                          }}
                        >
                          {item.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              item.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export const FormCheckbox = ({
  form,
  name,
  label,
  hidden,
  description,
}: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <>
          <FormItem
            // style={{ display: "none" }}
            className={`flex flex-row items-start space-x-1 space-y-0 ${
              hidden ? "hidden" : ""
            } `}
          >
            <FormControl>
              <Checkbox
                hidden={hidden}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
              <FormDescription>{description}</FormDescription>
            </div>
          </FormItem>
          {/* <FormMessage /> */}
        </>
      )}
    />
  );
};
