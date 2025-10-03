import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import { format, isSameDay } from "date-fns";
import axios from "axios";
import { Box, Badge, Text, VStack, Button, Flex } from "@chakra-ui/react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { ConfirmDialog } from "../ui/ConfirmDialog";

import { EditTaskModal } from "../TaskForm/EditTaskModal";

interface TaskListProps {
  selectedDate: Date | null;
  tasks: Task[];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");

  useEffect(() => {
    if (!selectedDate) return;

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<Task[]>(
          "http://localhost:5000/api/tasks"
        );

        // Map _id -> id and convert date strings to Date objects
        const tasksWithIdAndDate: Task[] = data.map((task: any) => ({
          id: task._id, // <- map MongoDB _id to id
          title: task.title,
          description: task.description,
          date: new Date(task.date), // convert string to Date
          tags: task.tags,
          status: task.status,
          priority: task.priority,
        }));

        // Filter tasks for the selected date
        const filteredTasks1 = tasksWithIdAndDate.filter((task) =>
          isSameDay(task.date, selectedDate)
        );

        setTasks(filteredTasks1);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  const availableTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true;
    const matchesTag = tagFilter ? task.tags.includes(tagFilter) : true;
    return matchesStatus && matchesPriority && matchesTag;
  });

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

  // Handler for edit
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setTaskToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <Box mt={5} width="40%">
      <Text fontSize="md" fontWeight="bold" mb={3} textAlign={"center"}>
        {selectedDate
          ? `Tasks for ${format(selectedDate, "PPP")}`
          : "Select a date"}
      </Text>

      {loading && <Text>Loading tasks...</Text>}
      {error && <Text color="red.500">{error}</Text>}
      {!loading && !error && tasks.length === 0 && (
        <Text>No tasks for this date.</Text>
      )}

      {!loading && !error && tasks.length > 0 && (
        <Box
          mb={4}
          display="flex"
          gap={2}
          justifyContent={"space-between"}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="sm"
          _hover={{ shadow: "md" }}
        >
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Tag Filter */}
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="">All Tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </Box>
      )}

      <VStack
        gap={4}
        align="stretch"
        display={"flex"}
        justifyContent={"space-between"}
      >
        {filteredTasks.map((task) => (
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
            <Text mb={2}>{task.description}</Text>

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

            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={() => handleEdit(task)}
            >
              <FiEdit2 />
              Edit
            </Button>
            <Button
              ms={3}
              size="sm"
              colorScheme="red"
              variant="outline"
              bg="red.500"
              color="white"
              _hover={{ bg: "red.600" }}
              onClick={() => handleDeleteClick(task)}
            >
              <FiTrash />
              Delete
            </Button>
          </Box>
        ))}
      </VStack>
      {selectedTask && (
        <EditTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={selectedTask}
          onUpdate={handleUpdateTask}
        />
      )}
      {isConfirmOpen && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setTaskToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Task"
          message={`Are you sure you want to delete "${taskToDelete?.title}" ?`}
        />
      )}
    </Box>
  );
};
