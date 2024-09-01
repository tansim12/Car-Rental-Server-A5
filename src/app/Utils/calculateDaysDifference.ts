import AppError from "../Error-Handle/AppError";

export function calculateDaysDifference(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if startDate is later than endDate
  if (start > end) {
    return 404 
  }

  // Calculate the time difference in milliseconds
  const timeDifference = end.getTime() - start.getTime();

  // Convert time difference from milliseconds to days
  const dayDifference = timeDifference / (1000 * 3600 * 24);

  // If `dayDifference` is 0, it means startDate and endDate are the same
  return dayDifference === 0 ? 1 : dayDifference + 1;
}
