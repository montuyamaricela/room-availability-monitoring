/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  format,
  addMinutes,
  parse,
  isWithinInterval,
  isBefore,
  isAfter,
  set,
  isPast,
} from "date-fns";
import { start } from "repl";

// Generate time slots
export function generateTimeSlots(
  start: string,
  end: string,
  interval: number,
): { label: string; value: string }[] {
  const slots: { label: string; value: string }[] = [];
  const startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  let currentTime = startTime;

  while (currentTime <= endTime) {
    const formattedTime = format(currentTime, "h:mm a");
    slots.push({
      label: formattedTime.toUpperCase(),
      value: formattedTime.toUpperCase(),
    });
    currentTime = addMinutes(currentTime, interval);
  }

  return slots;
}

// Convert time string to Date
function timeStringToDate(time: string): Date {
  return parse(time, "h:mm a", new Date());
}

// Filter time slots based on an array of schedules
export function filterTimeSlots(
  slots: { label: string; value: string }[],
  schedules: { start: Date; end: Date; day: string }[],
): { label: string; value: string }[] {
  const today = new Date();
  const todaysSchedules = schedules.filter(
    (schedule) => schedule.day === format(today, "EEEE"),
  );
  return slots.filter((slot) => {
    const slotTime = timeStringToDate(slot.value);
    // Check if the slot falls within any of today's schedules
    return !todaysSchedules.some((schedule) => {
      // Assuming schedule.start and schedule.end are Date objects in UTC
      const startTime = timeStringToDate(formatTimetoLocal(schedule.start));
      const endTime = timeStringToDate(formatTimetoLocal(schedule.end));

      return isWithinInterval(slotTime, { start: startTime, end: endTime });
    });
  });
}

// Check if two time ranges overlap
export function isOverlapping(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean {
  return isBefore(start1, end1) && isBefore(start2, end2);
}

export function formatTimetoLocal(time: Date) {
  const date = new Date(time);

  // Force the time to be displayed in UTC or another specific timezone
  const formattedDate = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC", // Change this to 'UTC' or your desired time zone
  });

  return formattedDate;
}
