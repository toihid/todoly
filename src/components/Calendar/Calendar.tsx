import { Box } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/css/style.css"; // your custom styles
import { useState } from "react";

interface ChakraDatepickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export const Calendar = ({
  selectedDate,
  onSelectDate,
}: ChakraDatepickerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(selectedDate);

  const handleChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      onSelectDate(date);
    }
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
      />
    </Box>
  );
};
