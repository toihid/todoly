import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Textarea,
  CloseButton,
  HStack,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { Task } from "../../types/task";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

// Define dynamic arrays for status and priority based on Task type
const statusOptions: Task["status"][] = ["pending", "in-progress", "completed"];
const priorityOptions: Task["priority"][] = ["low", "medium", "high"];

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask } ) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<Task["status"]>("pending");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title || !date) return;

    const taskData: Task = {
      title,
      description,
      date: new Date(date),
      tags,
      status,
      priority,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        taskData,
        { headers: { "Content-Type": "application/json" } }
      );

      onAddTask(response.data);

      // Show success message
      setSuccessMessage(`Task "${response.data.title}" saved successfully!`);

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTags([]);
      setTagInput("");
      setStatus("pending");
      setPriority("medium");
      setIsOpen(false);

      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3s
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {successMessage && (
        <Text mb={4} color="green.500" fontWeight="bold">
          {successMessage}
        </Text>
      )}

      <Button colorScheme="blue" onClick={() => setIsOpen(true)} mb={4}>
        Add Task
      </Button>

      {isOpen && (
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
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            minW="350px"
            maxW="500px"
            boxShadow="lg"
          >
            <HStack justifyContent="space-between" mb={4}>
              <Heading size="md">Add Task</Heading>
              <CloseButton onClick={() => setIsOpen(false)} />
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

              {/* Dynamic Status and Priority */}
              <HStack gap={3}>
                <Box>
                  <label>Status:</label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as Task["status"])
                    }
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E0",
                    }}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s
                          .replace("-", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
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
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E0",
                    }}
                  >
                    {priorityOptions.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </Box>
              </HStack>

              {/* Tags input */}
              <Box>
                <Input
                  placeholder="Add tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  mb={2}
                />
                <HStack gap={2} wrap="wrap">
                  {tags.map((tag) => (
                    <Box
                      key={tag}
                      display="inline-flex"
                      alignItems="center"
                      bg="blue.500"
                      color="white"
                      borderRadius="full"
                      px={2}
                      py={1}
                      fontSize="sm"
                    >
                      {tag}
                      <CloseButton
                        size="sm"
                        ml={1}
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Box>
                  ))}
                </HStack>
              </Box>

              <HStack justify="flex-end" gap={3} pt={2}>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Save
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};
