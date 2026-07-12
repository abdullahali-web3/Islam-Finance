import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';

// NOTE: WatermelonDB's SQLite adapter is a native module — it requires a custom Expo dev
// client build (`npx expo prebuild` + a dev client, per docs/adr — this app is not
// Expo-Go-compatible by design), not the stock Expo Go app.
const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
});

export const database = new Database({
  adapter,
  modelClasses: [],
});
