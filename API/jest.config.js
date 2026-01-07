export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],

  moduleFileExtensions: ['ts', 'js'],

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts'
  ],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  }
}
