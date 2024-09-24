/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { format, addMinutes, parse, isWithinInterval } from "date-fns";

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

function timeStringToDate(time: string): Date {
  return parse(time, "h:mm a", new Date());
}

export function filterTimeSlots(
  slots: { label: string; value: string }[],
  schedules: { start: Date; end: Date; day: string }[],
  day?: string,
): { label: string; value: string }[] {
  const today = new Date();

  const todaysSchedules = schedules.filter((schedule) => {
    const currentDay = day ?? format(today, "EEEE");
    return schedule.day === currentDay;
  });

  return slots.filter((slot) => {
    const slotTime = timeStringToDate(slot.value);
    return !todaysSchedules.some((schedule) => {
      const startTime = timeStringToDate(formatTimetoLocal(schedule.start));
      const endTime = timeStringToDate(formatTimetoLocal(schedule.end));

      return isWithinInterval(slotTime, { start: startTime, end: endTime });
    });
  });
}

export function isOverlapping(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean {
  const overlap = start1 < end2 && start2 < end1;
  return overlap;
}

export function formatTimetoLocal(time: Date) {
  const date = new Date(time);

  const formattedDate = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  });

  return formattedDate;
}

export function parseTime(timeString: any) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));

  return date;
}
