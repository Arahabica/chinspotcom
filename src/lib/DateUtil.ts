export const getMidnight = (date: Date): Date => {
  const nextDay = japanDate(date);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay;
}

export const japanDate = (date: Date): Date => {
  const offset = date.getTimezoneOffset() - 9 * 60;
  return new Date(date.getTime() + offset * 60 * 1000);
}