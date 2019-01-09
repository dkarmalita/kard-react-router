module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "**/src/**/*.{js,jsx}"
  ],
  coverageDirectory: "coverage",
  coverageReporters: [
    "lcov",
  ],
  moduleDirectories: [
    "node_modules",
    "<rootDir>/src/",
  ],
  rootDir: './',
  roots: [
    "<rootDir>",
  ],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/test/",
    "/*.bak/",
    "/*.bak.js/",
    "/*.draft.*/",
  ],
  verbose: true,
};
