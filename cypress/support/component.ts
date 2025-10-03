import './commands';
import { mount } from 'cypress/react';

Cypress.Commands.add('mount', mount);

// TypeScript support for cy.mount()
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
import "./mount";
