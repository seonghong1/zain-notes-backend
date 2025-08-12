export function getUtcStartAndEndDates(timestamp: number): {
  startDate: Date;
  endDate: Date;
} {
  const date = new Date(timestamp);

  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );

  const endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

  return { startDate, endDate };
}
