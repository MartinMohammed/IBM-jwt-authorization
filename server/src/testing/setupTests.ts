import "dotenv/config";

// Mock the logger module
// Since every test runs in its own environment,
// these scripts will be executed in the testing environment before executing setupFilesAfterEnv and before the test code itself.
jest.mock("../logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
}));

// ------------------ MOCKING ------------------
