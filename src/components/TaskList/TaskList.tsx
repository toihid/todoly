import type { Task } from "../../types/task";
import { format } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  selectedDate: Date | null;
}

export const TaskList = ({ tasks, selectedDate }: TaskListProps) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>
        {selectedDate
          ? `Tasks for ${format(selectedDate, "PPP")}`
          : "Select a date"}
      </h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      ) : (
        <p>No tasks</p>
      )}
    </div>
  );
};
