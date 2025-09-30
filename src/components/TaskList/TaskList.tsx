import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import { format, isSameDay } from "date-fns";
import axios from "axios";
import { Box, Badge, Text, VStack } from "@chakra-ui/react";

interface TaskListProps {
  selectedDate: Date | null;
}

// Task interface (task.js/types)
// export interface Task {
//   id: string;
//   title: string;
//   details: string;
//   date: Date;
//   priority: "Low" | "Normal" | "High";
//   status: "Pending" | "In-Progress" | "Completed";
//   tags: string[];
// }

export const TaskList = ({ selectedDate }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<Task[]>(
          "http://localhost:5000/api/tasks"
        );

        // Convert date strings to Date objects
        const tasksWithDate: Task[] = data.map((task) => ({
          ...task,
          date: new Date(task.date),
        }));

        // Filter tasks for the selected date
        const filteredTasks = tasksWithDate.filter((task) =>
          isSameDay(task.date, selectedDate)
        );

        setTasks(filteredTasks);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red.400";
      case "normal":
        return "yellow.400";
      case "low":
        return "green.400";
      default:
        return "gray.400";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange.400";
      case "in-progress":
        return "blue.400";
      case "completed":
        return "green.500";
      default:
        return "gray.400";
    }
  };

  return (
    <Box mt={5} width="30%">
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        {selectedDate
          ? `Tasks for ${format(selectedDate, "PPP")}`
          : "Select a date"}
      </Text>

      {loading && <Text>Loading tasks...</Text>}
      {error && <Text color="red.500">{error}</Text>}
      {!loading && !error && tasks.length === 0 && (
        <Text>No tasks for this date.</Text>
      )}

      <VStack
        gap={4}
        align="stretch"
        display={"flex"}
        justifyContent={"center"}
      >
        {tasks.map((task) => (
          <Box
            key={task.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ shadow: "md" }}
          >
            <Text fontWeight="bold" fontSize="lg">
              {task.title}
            </Text>
            <Text mb={2}>{task.details}</Text>

            {/* Priority Badge */}
            <Badge
              mr={2}
              px={2}
              py={1}
              borderRadius="md"
              bg={getPriorityColor(task.priority)}
              color="white"
            >
              {task.priority}
            </Badge>

            {/* Status Badge */}
            <Badge
              mr={2}
              px={2}
              py={1}
              borderRadius="md"
              bg={getStatusColor(task.status)}
              color="white"
            >
              {task.status}
            </Badge>

            {/* Tags */}
            {task.tags.map((tag) => (
              <Badge
                key={tag}
                bg="#805AD5"
                color="white"
                mr={1}
                px={2}
                py={1}
                borderRadius="full"
              >
                #{tag}
              </Badge>
            ))}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
