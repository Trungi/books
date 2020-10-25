module.exports = {
  bail: true,
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.jest.json",
    },
  },
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testMatch: [
    "<rootDir>/**/*.spec.ts"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx"
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],
  modulePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],
  projects: [
    "<rootDir>",
  ],
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coveragePathIgnorePatterns: [
    ".*(spec|const|config|mock|module|index|mock|model).ts"
  ],
  coverageReporters: [
    "lcovonly",
    "html"
  ],
  testTimeout: 60000
};
