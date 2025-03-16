/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/lib/"
  ],
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};