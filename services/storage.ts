import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { createMMKV } from 'react-native-mmkv';

const ENCRYPTION_KEY_SLOT = 'mmkv_encryption_key_v2';

// The MMKV encryption key is a device-local secret used only to encrypt the on-device
// key/value store — it never leaves the device and is never an API/service credential.
// See docs/adr/0004-secrets.md.
//
// MMKV (Nitro, v4+) caps the key at 32 bytes for AES-256. We generate 16 random bytes
// (128 bits of entropy) and hex-encode them to a 32-character (= 32-byte) string, which
// is exactly the AES-256 maximum.
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

export const storage = createMMKV({
  id: 'islamfinance-storage',
  encryptionKey: getOrCreateEncryptionKey(),
  encryptionType: 'AES-256',
});
