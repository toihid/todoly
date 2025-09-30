export interface Task {
  id?: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  status: "pending" | "in-progress" | "completed"; // optional: restrict to specific strings
  priority: "low" | "medium" | "high"; // optional: restrict to specific strings
}
