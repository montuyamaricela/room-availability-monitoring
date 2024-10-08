/* eslint-disable @typescript-eslint/no-explicit-any */
// Utility function to group rows by same schedule (excluding the group)
export function groupSchedulesByCommonDetails(rows: any[]) {
  const grouped: Record<string, any[]> = {};

  rows.forEach((row) => {
    const key = `${row.room}-${row.room_building}-${row.day}-${row.start_time}-${row.end_time}-${row.instructor}-${row.subject}-${row.section_name}-${row.department_code}`;

    // Group rows by the same schedule details except for the group
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key]!.push(row);
  });

  return grouped;
}

export function groupSchedulesByCommonDetailsCSV(rows: any[]) {
  const grouped: Record<string, any[]> = {};

  rows.forEach((row) => {
    const key = `${row.room}-${row.Building}-${row.Day}-${row["Start Time"]}-${row["End Time"]}-${row.Instructor}-${row.Course}-${row.Section}-${row.Department}`;

    // Group rows by the same schedule details except for the group
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key]!.push(row);
  });

  return grouped;
}
