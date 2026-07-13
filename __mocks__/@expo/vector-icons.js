// Jest manual mock for @expo/vector-icons. Under Jest's eager resolver the real module pulls in
// expo-font -> expo-asset (a native font/asset loader) which has no business running in a Node test
// env; Metro resolves it fine on device, so this mock is test-only. Each icon set renders as a
// lightweight Text node carrying its `name`, so component tests can still assert on icons.
const React = require('react');
const { Text } = require('react-native');

function makeIconSet(setName) {
  const Icon = ({ name, ...rest }) => React.createElement(Text, rest, name || '');
  Icon.displayName = setName;
  Icon.glyphMap = {};
  return Icon;
}

// Return a mock component for any icon set requested (Ionicons, MaterialIcons, …).
module.exports = new Proxy(
  { __esModule: true },
  {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === 'symbol') return undefined;
      return makeIconSet(String(prop));
    },
  }
);
