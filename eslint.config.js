// ESLint 9 flat config. eslint-config-expo bundles the RN/Expo/TS rules.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    // `proxy/` is an independently-deployed serverless function with its own toolchain (ADR 0008).
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'proxy/*'],
  },
];
