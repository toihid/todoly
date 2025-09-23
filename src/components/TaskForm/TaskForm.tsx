import { useState } from "react";
//import { Task } from "../../types/task";
import type { Task } from "../../types/task";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!title || !date) return;

    onAddTask({ id: Date.now(), title, date: new Date(date) });
    setTitle("");
    setDate("");
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginRight: "8px", padding: "4px" }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginRight: "8px", padding: "4px" }}
      />
      <button onClick={handleSubmit} style={{ padding: "6px 12px" }}>
        Add Task
      </button>
    </div>
  );
};
