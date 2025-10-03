import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskForm } from "../components/TaskForm/TaskForm";
import { Provider } from "../components/ui/provider"; 

describe("TaskForm", () => {
  it("should not call onAddTask if the required fields are empty", () => {
    const onAddTask = vi.fn();

    render(
      <Provider>
        <TaskForm onAddTask={onAddTask} />
      </Provider>
    );

    // Öppna formuläret först
    fireEvent.click(screen.getByText(/add task/i));

    // Klicka på "Save" utan att fylla i fälten
    fireEvent.click(screen.getByText(/save/i));

    // Förvänta att onAddTask inte anropas
    expect(onAddTask).not.toHaveBeenCalled();
  });

  //it("should call onAddTask when all required fields are filled", () => {
  //  const onAddTask = vi.fn();
//
  //  render(
  //    <Provider>
  //      <TaskForm onAddTask={onAddTask} />
  //    </Provider>
  //  );
//
  //  // Fyll i de nödvändiga fälten
  //  fireEvent.click(screen.getAllByRole("button", { name: /add task/i })[0]);
  //  fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: "Test Task" } });
  //  fireEvent.change(screen.getByPlaceholderText(/details/i), { target: { value: "Test Details" } });
  //  fireEvent.change(screen.getByLabelText(/task date/i), { target: { value: "2025-10-30" } });
//
  //  // Klicka på "Save"
  //  fireEvent.click(screen.getByText(/save/i));
//
  //  // Förvänta att onAddTask anropas
  //  expect(onAddTask).toHaveBeenCalled();
  //});
});