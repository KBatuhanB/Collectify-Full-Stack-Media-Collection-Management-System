module.exports = {
  //maxWorkers: 1,
  testEnvironment: 'node', // Default environment for API tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: [
    '<rootDir>/src/test/**/*.test.{js,jsx}',
    '<rootDir>/tests/**/*.test.{js,jsx}'
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(axios|mongodb|bson|@mongodb-js)/)',
  ],
  // Specific test environment for React tests
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  projects: [
    {
      displayName: 'API Tests',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/test/*API*.test.js', '<rootDir>/src/test/*Upload*.test.js'],
    },
    {
      displayName: 'React Tests',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/test/*Context*.test.js', '<rootDir>/src/test/*Frontend*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    },
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'babel-jest': {
      useESM: true,
    },
  },
};
