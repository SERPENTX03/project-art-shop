export const RANGE_OPTIONS = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "This month",
  "This year",
  "Last year",
  "All time",
  "Custom",
] as const;

export type RangeOption = (typeof RANGE_OPTIONS)[number];

export function getDateRange(
  option: RangeOption
): { from: Date; to: Date } | null {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (option) {
    case "Today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end };

    case "Yesterday":
      start.setDate(now.getDate() - 1);
      end.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end };

    case "Last 7 days":
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { from: start, to: end };

    case "Last 30 days":
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return { from: start, to: end };

    case "This month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return { from: start, to: end };

    case "This year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      return { from: start, to: end };

    case "Last year":
      start.setFullYear(now.getFullYear() - 1, 0, 1);
      end.setFullYear(now.getFullYear() - 1, 11, 31);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end };

    default:
      return null;
  }
}
