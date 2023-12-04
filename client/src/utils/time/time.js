import { differenceInMinutes, differenceInHours, format, isToday } from "date-fns";

export function getTimeAgo(creationDate) {
  const now = new Date();
  if (isToday(creationDate)) {
    const minutesAgo = differenceInMinutes(now, creationDate);
    const hoursAgo = differenceInHours(now, creationDate);
    return minutesAgo < 60 ? `${minutesAgo}m` : `${hoursAgo}h`;
  } else {
    return format(creationDate, "MM/dd/yy");
  }
}
