module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: 1,
  errorOnDeprecated: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
