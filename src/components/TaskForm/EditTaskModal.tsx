import {
  Box,
  Button,
  Input,
  Textarea,
  CloseButton,
  HStack,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import type { Task } from "../../types/task";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (task: Task) => void;
}

const statusOptions: Task["status"][] = ["pending", "in-progress", "completed"];
const priorityOptions: Task["priority"][] = ["low", "medium", "high"];

export const EditTaskModal = ({
  isOpen,
  onClose,
  task,
  onUpdate,
}: EditTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<Task["status"]>("pending");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [loading, setLoading] = useState(false);

  // Pre-fill values when a task is selected
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDate(task.date ? new Date(task.date).toISOString().split("T")[0] : "");
      setTags(task.tags || []);
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  const handleUpdate = async () => {
    if (!task) return;
    if (!title || !date) return;

    const updatedTask: Task = {
      ...task,
      title,
      description,
      date: new Date(date),
      tags,
      status,
      priority,
    };

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${task.id}`,
        updatedTask,
        { headers: { "Content-Type": "application/json" } }
      );
      onUpdate(response.data);
      onClose();
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bg="rgba(0,0,0,0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
    >
      <Box bg="white" p={6} borderRadius="md" minW="350px" maxW="500px">
        <HStack justify="space-between" mb={4}>
          <Heading size="md">Edit Task</Heading>
          <CloseButton onClick={onClose} />
        </HStack>

        <VStack gap={3} align="stretch">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Task details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <HStack>
            <Box>
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Box>

            <Box>
              <label>Priority:</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Task["priority"])
                }
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Box>
          </HStack>

          <HStack justify="flex-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdate} loading={loading}>
              Update
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};
