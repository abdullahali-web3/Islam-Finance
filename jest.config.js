/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Path aliases from tsconfig.json, mirrored for Jest's module resolver.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // React Native Testing Library (ADR 0011's component-test layer) auto-extends Jest with its
  // built-in matchers (toHaveTextContent, toBeOnTheScreen, …) on first import — no setup file needed.
};
