const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
  moduleNameMapper: {
    // Resolve the @/ path alias (next/jest handles this via SWC transform for
    // imports, but jest.mock() is hoisted before transforms and needs this map).
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = createJestConfig(config);
