import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

const ENCRYPTION_KEY_SLOT = 'mmkv_encryption_key_v2';

/**
 * Minimal key/value surface the app depends on. Production uses encrypted MMKV (ADR 0002/0004);
 * Expo Go uses an in-memory stand-in (see below), so both must satisfy this interface.
 */
export interface AppStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
}

// The MMKV encryption key is a device-local secret used only to encrypt the on-device key/value
// store — it never leaves the device and is never an API/service credential. See ADR 0004.
// MMKV (Nitro, v4+) caps the key at 32 bytes for AES-256: 16 random bytes hex-encoded = 32 chars.
function getOrCreateEncryptionKey(): string {
  const existing = SecureStore.getItem(ENCRYPTION_KEY_SLOT);
  if (existing) return existing;

  const bytes = Crypto.getRandomBytes(16);
  const key = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  SecureStore.setItem(ENCRYPTION_KEY_SLOT, key);
  return key;
}

/**
 * In-memory fallback used ONLY in Expo Go. MMKV is a native module Expo Go doesn't bundle, so
 * without this the app would crash on launch when the settings store initializes. This lets the UI
 * and flows be tested on a phone via Expo Go with no custom build. Trade-off: data does not persist
 * across app restarts in Expo Go — that's fine for testing. Real builds (dev-client / production)
 * always use the encrypted MMKV below, so this never affects shipped behavior.
 */
function createInMemoryStorage(): AppStorage {
  const mem = new Map<string, string>();
  return {
    getString: (key) => mem.get(key),
    set: (key, value) => {
      mem.set(key, value);
    },
    remove: (key) => {
      mem.delete(key);
    },
  };
}

// executionEnvironment === 'storeClient' is Expo Go specifically; dev-client and production builds
// report 'standalone'/'bare' and take the MMKV path.
const isExpoGo = Constants.executionEnvironment === 'storeClient';

function createStorage(): AppStorage {
  if (isExpoGo) {
    if (__DEV__) {
      console.warn(
        '[storage] Running in Expo Go: using a non-persistent in-memory store. Data will reset on ' +
          'restart. Use a dev-client build for encrypted persistence (History, saved settings).'
      );
    }
    return createInMemoryStorage();
  }
  // Loaded lazily so react-native-mmkv's native module is never touched in Expo Go.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  return createMMKV({
    id: 'islamfinance-storage',
    encryptionKey: getOrCreateEncryptionKey(),
    encryptionType: 'AES-256',
  });
}

export const storage: AppStorage = createStorage();
