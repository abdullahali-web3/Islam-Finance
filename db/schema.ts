import { appSchema } from '@nozbe/watermelondb';

// No tables yet — Phase 0 has no calculators. Each domain adds its own history table here
// once it ships (e.g. zakat_calculations, inheritance_calculations), following the pattern
// documented in docs/adr/0002-state-and-storage.md. Bump `version` and add a migration
// whenever a table is added, per WatermelonDB's migration requirements.
export const schema = appSchema({
  version: 1,
  tables: [],
});
