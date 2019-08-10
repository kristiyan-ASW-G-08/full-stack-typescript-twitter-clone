module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'source'],
  moduleNameMapper: {
    'src/(.*)$': '<rootDir>/source/$1',
    'customTypes/(.*)$': '<rootDir>/source/types/$1',
    'schemaValidators/(.*)$': '<rootDir>/source/schemaValidators/$1',
  },
};
