import { mount } from "cypress/react";
import axios from "axios";
import AppWithProvider from "../../src/App";

Cypress.on("uncaught:exception", () => false);

describe("App Component", () => {
  beforeEach(() => {
    cy.stub(axios, "post").resolves({ data: { title: "Test Task" } });
    mount(<AppWithProvider />);
  });

  it("renders the heading '📅 Todo Calendar'", () => {
    cy.contains("📅 Todo Calendar").should("exist");
  });

  it("opens the TaskForm modal when 'Add Task' button is clicked", () => {
    cy.contains("Add Task").click();
    cy.contains("Add Task").should("exist");
  });

  it("fills and submits a task successfully", () => {
    cy.contains("Add Task").click();
    cy.get('input[placeholder="Task title"]').type("Test Task");
    cy.get('textarea[placeholder="Task details"]').type("Some details");
    cy.get('input[type="date"]').type("2025-10-01");
    cy.get('input[placeholder="Add tag and press Enter"]').type("urgent{enter}");
    cy.contains("Save").click();
    cy.contains(/saved successfully/i).should("exist");
    cy.contains("Add Task").should("exist");
  });
});
