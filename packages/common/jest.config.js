module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    'src/(.*)$': '<rootDir>/src/$1',
    'customTypes/(.*)$': '<rootDir>/src/types/$1',
    'schemaValidators/(.*)$': '<rootDir>/src/schemaValidators/$1',
  },
};
