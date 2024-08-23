export const getMidnight = (date: Date): Date => {
  const nextDay = new Date(date);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay;
}
