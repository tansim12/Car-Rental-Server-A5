// Function to convert time in HH:mm format to total hours
export const timeToHours = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};
