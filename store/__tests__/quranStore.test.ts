import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useQuranStore } from '../quranStore';

// The store persists via MMKV (services/storage), whose native module isn't available under Jest.
// Swap it for the in-memory manual mock (services/__mocks__/storage.ts) so the real store logic runs.
jest.mock('@/services/storage');

const reset = () => {
  useQuranStore.setState({ lastRead: null, bookmarks: [] });
};
const s = () => useQuranStore.getState();

beforeEach(reset);

describe('bookmarks', () => {
  it('toggles a bookmark on and off', () => {
    s().toggleBookmark(2, 255);
    expect(s().isBookmarked(2, 255)).toBe(true);
    expect(s().bookmarks).toHaveLength(1);

    s().toggleBookmark(2, 255);
    expect(s().isBookmarked(2, 255)).toBe(false);
    expect(s().bookmarks).toHaveLength(0);
  });

  it('keeps bookmarks in mushaf order regardless of insertion order', () => {
    s().toggleBookmark(114, 1);
    s().toggleBookmark(2, 255);
    s().toggleBookmark(2, 1);
    s().toggleBookmark(18, 10);

    expect(s().bookmarks.map((b) => `${b.surah}:${b.ayah}`)).toEqual([
      '2:1',
      '2:255',
      '18:10',
      '114:1',
    ]);
  });

  it('removeBookmark removes a specific verse and leaves the rest', () => {
    s().toggleBookmark(1, 1);
    s().toggleBookmark(1, 2);
    s().removeBookmark(1, 1);

    expect(s().isBookmarked(1, 1)).toBe(false);
    expect(s().isBookmarked(1, 2)).toBe(true);
  });

  it('clearBookmarks empties the list but leaves lastRead untouched', () => {
    s().toggleBookmark(1, 1);
    s().setLastRead(2, 5);
    s().clearBookmarks();

    expect(s().bookmarks).toHaveLength(0);
    expect(s().lastRead).toEqual({ surah: 2, ayah: 5 });
  });

  it('rejects invalid verses — nothing is stored', () => {
    s().toggleBookmark(0, 1); // no surah 0
    s().toggleBookmark(115, 1); // no surah 115
    s().toggleBookmark(1, 8); // Al-Fatiha has 7 ayat
    s().toggleBookmark(2, 287); // Al-Baqara has 286
    s().toggleBookmark(9, 1.5); // non-integer ayah

    expect(s().bookmarks).toHaveLength(0);
  });

  it('accepts the last real ayah of a surah but not one past it', () => {
    s().toggleBookmark(1, 7); // Al-Fatiha's last ayah
    expect(s().isBookmarked(1, 7)).toBe(true);
    s().toggleBookmark(1, 8);
    expect(s().isBookmarked(1, 8)).toBe(false);
  });
});

describe('persist merge / hydration (defensive against a corrupt blob)', () => {
  // The merge runs on load against whatever is on disk. It must survive a malformed blob rather than
  // throw (a throw aborts hydration and silently wipes everything with no self-heal).
  const merge = useQuranStore.persist.getOptions().merge!;
  const run = (persisted: unknown) => merge(persisted, s()) as { lastRead: unknown; bookmarks: unknown[] };

  it('keeps valid entries, sorts them, and defaults missing timestamps', () => {
    const out = run({
      lastRead: { surah: 2, ayah: 5 },
      bookmarks: [
        { surah: 2, ayah: 255, createdAt: 10, updatedAt: 20 },
        { surah: 1, ayah: 1 }, // no timestamps
      ],
    });
    expect(out.lastRead).toEqual({ surah: 2, ayah: 5 });
    expect(out.bookmarks).toEqual([
      { surah: 1, ayah: 1, createdAt: expect.any(Number), updatedAt: expect.any(Number) },
      { surah: 2, ayah: 255, createdAt: 10, updatedAt: 20 },
    ]);
  });

  it('drops out-of-range verses on load', () => {
    const out = run({
      lastRead: { surah: 200, ayah: 1 },
      bookmarks: [
        { surah: 2, ayah: 999, createdAt: 1, updatedAt: 1 }, // Al-Baqara has 286
        { surah: 1, ayah: 1, createdAt: 1, updatedAt: 1 },
      ],
    });
    expect(out.lastRead).toBeNull();
    expect(out.bookmarks).toHaveLength(1);
    expect(out.bookmarks[0]).toMatchObject({ surah: 1, ayah: 1 });
  });

  it('does not throw on a structurally malformed blob — it degrades to empty', () => {
    for (const bad of [
      { bookmarks: [null] },
      { bookmarks: 'not-an-array' },
      { bookmarks: { surah: 1 } },
      { bookmarks: [5, 'x', true] },
      { bookmarks: [{ surah: '2', ayah: '255' }] }, // string fields
      { lastRead: 'x' },
      { lastRead: { surah: 2 } }, // missing ayah
      { lastRead: 42 },
      null,
      undefined,
      'garbage',
    ]) {
      expect(() => run(bad)).not.toThrow();
      const out = run(bad);
      expect(Array.isArray(out.bookmarks)).toBe(true);
      expect(out.bookmarks.every((b) => b && typeof b === 'object')).toBe(true);
    }
  });

  it('drops a null bookmark element but keeps the valid ones beside it', () => {
    const out = run({
      bookmarks: [null, { surah: 1, ayah: 1, createdAt: 1, updatedAt: 1 }, 'x'],
    });
    expect(out.bookmarks).toHaveLength(1);
    expect(out.bookmarks[0]).toMatchObject({ surah: 1, ayah: 1 });
  });
});

describe('lastRead', () => {
  it('records a valid position', () => {
    s().setLastRead(18, 10);
    expect(s().lastRead).toEqual({ surah: 18, ayah: 10 });
  });

  it('ignores an invalid position', () => {
    s().setLastRead(200, 1);
    expect(s().lastRead).toBeNull();
    s().setLastRead(2, 999);
    expect(s().lastRead).toBeNull();
  });

  it('overwrites the previous position', () => {
    s().setLastRead(2, 1);
    s().setLastRead(2, 50);
    expect(s().lastRead).toEqual({ surah: 2, ayah: 50 });
  });
});
