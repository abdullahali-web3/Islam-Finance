// ESLint 9 flat config. eslint-config-expo bundles the RN/Expo/TS rules.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
];
