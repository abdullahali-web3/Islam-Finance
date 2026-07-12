/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Path aliases from tsconfig.json, mirrored for Jest's module resolver.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
