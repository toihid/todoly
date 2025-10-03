import React from "react";
import { mount } from "../support/mount";
import { Calendar } from "../../src/components/Calendar/Calendar.tsx";

describe("Calendar Component", () => {
  it("renders and allows date selection", () => {
    const onSelectDate = cy.spy().as("onSelectDate");

    mount(
      <Calendar
        selectedDate={new Date("2025-01-01")}
        onSelectDate={onSelectDate}
      />
    );

    // ✅ Calendar header visible
    cy.contains("January 2025").should("be.visible");

    // ✅ Select a day
    cy.get(".react-datepicker__day--015").click();

    // ✅ Verify callback
    cy.get("@onSelectDate").should("have.been.calledOnce");
  });
});
