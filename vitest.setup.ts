import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Jest-dom matchers
expect.extend(matchers);

// Chakra UI behöver matchMedia → mocka det i jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});