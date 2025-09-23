import { useState } from "react";
import type { Task } from "./types/task";
import { TaskForm } from "./components/TaskForm/TaskForm";
import { Calendar } from "./components/Calendar/Calendar";
import { TaskList } from "./components/TaskList/TaskList";
import { filterTasksByDate } from "./utils/dateUtils";
import { Box, Heading, VStack } from "@chakra-ui/react";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);

  return (
    <Box p={6} fontFamily="sans-serif">
      <Heading mb={6}>📅 Todo Calendar</Heading>

      <VStack>
        <TaskForm onAddTask={addTask} />
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <TaskList
          tasks={selectedDate ? filterTasksByDate(tasks, selectedDate) : []}
          selectedDate={selectedDate}
        />
      </VStack>
    </Box>
  );
}

export default App;
