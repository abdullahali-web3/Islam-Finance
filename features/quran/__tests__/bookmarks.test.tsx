// UI-layer coverage for bookmarks + continue-reading. The store logic is unit-tested in
// store/__tests__/quranStore.test.ts; this checks the reader/list actually drive it.

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';
import { useQuranStore } from '@/store/quranStore';
import { SurahReaderScreen } from '../SurahReaderScreen';
import { BookmarksScreen } from '../BookmarksScreen';
import { ReadingShortcuts } from '../ReadingShortcuts';
import { renderWithSafeArea as render } from '../testUtils';

jest.mock('@/services/storage'); // in-memory MMKV stand-in
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

beforeEach(() => {
  useQuranStore.setState({ lastRead: null, bookmarks: [] });
  mockPush.mockClear();
});

describe('resume / deep-link ayah safety', () => {
  // Regression for the crash a shared link islamfinance://quran/1?ayah=8 caused: an out-of-range
  // ayah reached FlatList.scrollToIndex and threw an uncaught Invariant Violation. The reader now
  // validates initialAyah against the surah before it can drive scroll math.
  it.each([
    ['out of range for Al-Fatiha (7 ayat)', 1, 8],
    ['far out of range', 2, 999],
    ['valid in-range resume', 1, 3],
    ['no ayah given', 2, undefined],
  ])('renders without crashing: %s', async (_label, surah, ayah) => {
    const meta = surah === 1 ? 'Al-Faatiha' : 'Al-Baqara';
    const { getByText } = await render(<SurahReaderScreen surah={surah} initialAyah={ayah} />);
    expect(getByText(meta)).toBeTruthy();
  });
});

describe('bookmarking from the reader', () => {
  it('toggles a bookmark when the ayah bookmark button is pressed', async () => {
    const { getByLabelText } = await render(<SurahReaderScreen surah={1} />);

    expect(useQuranStore.getState().isBookmarked(1, 1)).toBe(false);

    await fireEvent.press(getByLabelText('Bookmark ayah 1:1'));
    expect(useQuranStore.getState().isBookmarked(1, 1)).toBe(true);

    // The label flips to the remove action once bookmarked.
    await fireEvent.press(getByLabelText('Remove bookmark for ayah 1:1'));
    expect(useQuranStore.getState().isBookmarked(1, 1)).toBe(false);
  });
});

describe('ReadingShortcuts', () => {
  it('renders nothing for a first-run user', async () => {
    const { queryByText } = await render(<ReadingShortcuts />);
    expect(queryByText('Continue reading')).toBeNull();
    expect(queryByText('Bookmarks')).toBeNull();
  });

  it('shows a continue-reading entry that resumes at the saved verse', async () => {
    useQuranStore.setState({ lastRead: { surah: 2, ayah: 255 } });
    const { getByText, getByLabelText } = await render(<ReadingShortcuts />);

    expect(getByText('Continue reading')).toBeTruthy();
    expect(getByText(/Al-Baqara · 2:255/)).toBeTruthy();

    await fireEvent.press(getByLabelText(/Continue reading Al-Baqara, ayah 2:255/));
    expect(mockPush).toHaveBeenCalledWith('/quran/2?ayah=255');
  });

  it('shows a bookmarks entry with the count that opens the bookmarks screen', async () => {
    useQuranStore.setState({
      bookmarks: [
        { surah: 1, ayah: 1, createdAt: 1, updatedAt: 1 },
        { surah: 2, ayah: 255, createdAt: 2, updatedAt: 2 },
      ],
    });
    const { getByText, getByLabelText } = await render(<ReadingShortcuts />);

    expect(getByText('Bookmarks')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();

    await fireEvent.press(getByLabelText(/Bookmarks, 2 saved/));
    expect(mockPush).toHaveBeenCalledWith('/quran/bookmarks');
  });
});

describe('BookmarksScreen', () => {
  it('lists saved ayat and opens one at its verse', async () => {
    useQuranStore.setState({ bookmarks: [{ surah: 2, ayah: 255, createdAt: 1, updatedAt: 1 }] });
    const { getByText, getByLabelText } = await render(<BookmarksScreen />);

    expect(getByText(/Al-Baqara · 2:255/)).toBeTruthy();

    await fireEvent.press(getByLabelText(/Open Al-Baqara, ayah 2:255/));
    expect(mockPush).toHaveBeenCalledWith('/quran/2?ayah=255');
  });

  it('removes a bookmark from the list', async () => {
    useQuranStore.setState({ bookmarks: [{ surah: 1, ayah: 1, createdAt: 1, updatedAt: 1 }] });
    const { getByLabelText } = await render(<BookmarksScreen />);

    await fireEvent.press(getByLabelText('Remove bookmark for ayah 1:1'));
    expect(useQuranStore.getState().bookmarks).toHaveLength(0);
  });

  it('shows an empty state with no bookmarks', async () => {
    const { getByText } = await render(<BookmarksScreen />);
    expect(getByText('No bookmarks yet')).toBeTruthy();
  });
});
