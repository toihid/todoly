import { Box } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/css/style.css"; // your custom styles
import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import axios from "axios";

interface ChakraDatepickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export const Calendar = ({
  selectedDate,
  onSelectDate,
}: ChakraDatepickerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(selectedDate);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      onSelectDate(date);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<Task[]>(
          "http://localhost:5000/api/tasks"
        );

        const tasksWithIdAndDate: Task[] = data.map((task: any) => ({
          id: task._id, // <- map MongoDB _id to id
          title: task.title,
          description: task.description,
          date: new Date(task.date), // convert string to Date
          tags: task.tags,
          status: task.status,
          priority: task.priority,
        }));

        setTasks(tasksWithIdAndDate);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  // ✅ Compare only by year/month/day (ignore hours/minutes)
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // ✅ Check if a given date has any tasks
  const hasTaskOnDate = (date: Date, tasks: Task[]): boolean => {
    return tasks.some((task) => isSameDay(task.date, date));
  };

  // ✅ Return CSS class if a date has a task
  const getDayClassName = (date: Date): string => {
    return hasTaskOnDate(date, tasks) ? "task-day" : "";
  };

  return (
    <Box w="30%">
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        dateFormat="yyyy-MM-dd"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        inline // calendar always visible
        dayClassName={getDayClassName} // ✅ cleaner function call
      />
    </Box>
  );
};
