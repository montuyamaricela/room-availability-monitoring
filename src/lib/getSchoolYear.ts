import { getYear } from "date-fns";

export const getSchoolYears = () => {
  const currentYear = getYear(new Date()); // Get the current year
  const years = [];

  // Generate up to 5 school years
  for (let i = 0; i < 5; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    const yearLabel = `${startYear}-${endYear}`;

    // Push to the array with Value and Label
    years.push({
      schoolYear: yearLabel,
    });
  }

  return years;
};
