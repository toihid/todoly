import { format } from "date-fns";

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onSelectDate }: CalendarProps) => {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const days = Array.from({ length: end.getDate() }, (_, i) => {
    return new Date(today.getFullYear(), today.getMonth(), i + 1);
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "5px",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "6px",
      }}
    >
      {days.map((day) => (
        <div
          key={day.toDateString()}
          onClick={() => onSelectDate(day)}
          style={{
            cursor: "pointer",
            padding: "10px",
            textAlign: "center",
            borderRadius: "4px",
            backgroundColor:
              selectedDate && day.toDateString() === selectedDate.toDateString()
                ? "#90cdf4"
                : "#f9f9f9",
          }}
        >
          {format(day, "d")}
        </div>
      ))}
    </div>
  );
};
