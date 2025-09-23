import { isSameDay } from "date-fns";
import type { Task } from "../types/task";

export const filterTasksByDate = (tasks: Task[], date: Date) =>
  tasks.filter((t) => isSameDay(t.date, date));
