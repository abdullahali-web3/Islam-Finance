// Manual Jest mock for services/storage. The real module builds an encrypted MMKV instance, whose
// native NitroModules aren't available in the Node test env (and SecureStore/Crypto key handling has
// no business running there). Tests that render store-connected screens `jest.mock('@/services/storage')`
// to get this in-memory stand-in instead. Same idea as __mocks__/@expo/vector-icons.js.

import type { AppStorage } from '../storage';

const mem = new Map<string, string>();

export const storage: AppStorage = {
  getString: (key) => mem.get(key),
  set: (key, value) => {
    mem.set(key, value);
  },
  remove: (key) => {
    mem.delete(key);
  },
};
