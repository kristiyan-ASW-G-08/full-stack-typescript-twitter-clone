require('dotenv').config();

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    'src/(.*)$': '<rootDir>/src/$1',
    'routes/(.*)$': '<rootDir>/src/routes//$1',
    'models/(.*)$': '<rootDir>/src/models/$1',
    'controllers/(.*)$': '<rootDir>/src/controllers/$1',
    'customTypes/(.*)$': '<rootDir>/src/types/$1',
    'utilities/(.*)$': '<rootDir>/src/utilities/$1',
    'middleware/(.*)$': '<rootDir>/src/middleware/$1',
  },
};
