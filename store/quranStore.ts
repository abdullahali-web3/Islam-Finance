import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { storage } from '@/services/storage';
import { isValidVerse, type VerseRef } from '@/core/quran';

/**
 * Quran reading state: last-read position + bookmarks.
 *
 * Two slices with DIFFERENT sync policies per ADR 0015, kept explicit here so the future Supabase
 * sync adapter (ADR 0014/0015) knows exactly what to touch:
 *   - `lastRead` is **local-always** — the transient "where am I right now" resume point. Never
 *     synced; it's device-specific and high-churn.
 *   - `bookmarks` are **synced-when-logged-in** — saved ayat the user means to keep. This store is
 *     the repository seam (the same role historyStore plays for calculations); the sync adapter
 *     implements add/remove/toggle against it without feature code changing.
 *
 * Every write is validated through core's isValidVerse, so a non-existent ayah can never be stored,
 * and the persist `merge` re-validates on load (dropping bad or malformed entries) so hydration
 * survives a corrupted blob rather than throwing.
 *
 * `updatedAt` exists for ADR 0015's sync model (last-write-wins per record by `updated_at`). It is
 * carried from the start so the future sync adapter doesn't have to migrate the row shape; deletes
 * are hard today (no tombstone) — representing a delete for the anonymous→login merge is the sync
 * adapter's job, not this local store's.
 */
export type Bookmark = VerseRef & { createdAt: number; updatedAt: number };

const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => {
    storage.remove(name);
  },
};

/** Mushaf order: surah ascending, then ayah ascending. Bookmarks read naturally in this order. */
function byMushafOrder(a: VerseRef, b: VerseRef): number {
  return a.surah - b.surah || a.ayah - b.ayah;
}

/** Shape guard for a persisted entry: a non-null object whose surah/ayah are numbers. Lets `merge`
 *  reject a malformed blob (null element, non-array, string field) without throwing on property
 *  access; isValidVerse then checks the actual range. */
function isVerseLike(v: unknown): v is VerseRef {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as { surah?: unknown }).surah === 'number' &&
    typeof (v as { ayah?: unknown }).ayah === 'number'
  );
}

type QuranState = {
  /** Local-always (ADR 0015). Null until the user has opened a surah. */
  lastRead: VerseRef | null;
  /** Sync-when-logged-in (ADR 0015). Kept in mushaf order. */
  bookmarks: Bookmark[];
  setLastRead: (surah: number, ayah: number) => void;
  /** Adds the bookmark if absent, removes it if present. No-op for an invalid verse. */
  toggleBookmark: (surah: number, ayah: number) => void;
  removeBookmark: (surah: number, ayah: number) => void;
  isBookmarked: (surah: number, ayah: number) => boolean;
  clearBookmarks: () => void;
};

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      lastRead: null,
      bookmarks: [],

      setLastRead: (surah, ayah) => {
        if (!isValidVerse(surah, ayah)) return;
        const cur = get().lastRead;
        if (cur && cur.surah === surah && cur.ayah === ayah) return; // avoid redundant writes
        set({ lastRead: { surah, ayah } });
      },

      toggleBookmark: (surah, ayah) => {
        if (!isValidVerse(surah, ayah)) return;
        set((s) => {
          const exists = s.bookmarks.some((b) => b.surah === surah && b.ayah === ayah);
          if (exists) {
            return { bookmarks: s.bookmarks.filter((b) => !(b.surah === surah && b.ayah === ayah)) };
          }
          const now = Date.now();
          return {
            bookmarks: [...s.bookmarks, { surah, ayah, createdAt: now, updatedAt: now }].sort(
              byMushafOrder,
            ),
          };
        });
      },

      removeBookmark: (surah, ayah) =>
        set((s) => ({
          bookmarks: s.bookmarks.filter((b) => !(b.surah === surah && b.ayah === ayah)),
        })),

      isBookmarked: (surah, ayah) =>
        get().bookmarks.some((b) => b.surah === surah && b.ayah === ayah),

      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'quran-store',
      storage: createJSONStorage(() => mmkvStorage),
      // Persist data only, not the action functions.
      partialize: (s) => ({ lastRead: s.lastRead, bookmarks: s.bookmarks }),
      // Defensive against a corrupted/older persisted blob: guards SHAPE (not just verse range) so a
      // malformed payload drops to a clean empty state instead of throwing and aborting hydration
      // (which would silently and permanently wipe all bookmarks with no self-heal). isValidVerse
      // already rejects non-integers, so a non-number surah/ayah is filtered, not trusted.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Record<string, unknown>;

        const lr = p.lastRead;
        const lastRead =
          isVerseLike(lr) && isValidVerse(lr.surah, lr.ayah) ? { surah: lr.surah, ayah: lr.ayah } : null;

        const rawList = Array.isArray(p.bookmarks) ? p.bookmarks : [];
        const bookmarks: Bookmark[] = rawList
          .filter((b): b is VerseRef & { createdAt?: unknown; updatedAt?: unknown } =>
            isVerseLike(b) && isValidVerse(b.surah, b.ayah),
          )
          .map((b) => {
            const createdAt = typeof b.createdAt === 'number' ? b.createdAt : Date.now();
            const updatedAt = typeof b.updatedAt === 'number' ? b.updatedAt : createdAt;
            return { surah: b.surah, ayah: b.ayah, createdAt, updatedAt };
          })
          .sort(byMushafOrder);

        return { ...current, lastRead, bookmarks };
      },
    }
  )
);
