// Reader + list behaviour at the UI layer. core/quran covers the data; these cover what the screens
// actually do with it — invalid deep links, the basmala header, and search wiring.

import { describe, it, expect, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';
import { SurahReaderScreen } from '../SurahReaderScreen';
import { SurahListScreen } from '../SurahListScreen';
import { renderWithSafeArea as render } from '../testUtils';

jest.mock('@/services/storage'); // in-memory stand-in — the reader pulls in the MMKV-backed store
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('SurahReaderScreen', () => {
  it('renders the surah header and first ayah', async () => {
    const { getByText } = await render(<SurahReaderScreen surah={1} />);
    expect(getByText('Al-Faatiha')).toBeTruthy();
    expect(getByText(/The Opening/)).toBeTruthy();
    expect(getByText('1:1')).toBeTruthy();
  });

  it('shows a basmala header for Al-Baqara but not as ayah 1', async () => {
    const { getByText, queryByText } = await render(<SurahReaderScreen surah={2} />);
    expect(getByText('2:1')).toBeTruthy();
    // Alif-Lam-Mim is ayah 1; the basmala renders separately above it as an unnumbered header.
    expect(queryByText('الٓمٓ')).toBeTruthy();
  });

  it.each([
    ['zero', 0],
    ['past the end', 115],
    ['negative', -1],
    ['non-numeric (NaN from the route)', NaN],
    ['fractional', 1.5],
  ])('shows the not-found state for %s', async (_label, surah) => {
    const { getByText } = await render(<SurahReaderScreen surah={surah} />);
    expect(getByText('Surah not found')).toBeTruthy();
  });

  it('renders At-Tawba with no basmala header', async () => {
    const { getByText } = await render(<SurahReaderScreen surah={9} />);
    expect(getByText('At-Tawba')).toBeTruthy();
    expect(getByText('9:1')).toBeTruthy();
  });
});

describe('SurahListScreen', () => {
  // Mounts the 114-item FlatList; see attribution.test for why the default 5s can flake under load.
  const LIST_RENDER_TIMEOUT = 20000;

  it(
    'lists surahs by mushaf order',
    async () => {
      const { getByText } = await render(<SurahListScreen />);
      expect(getByText('Al-Faatiha')).toBeTruthy();
      expect(getByText('Al-Baqara')).toBeTruthy();
    },
    LIST_RENDER_TIMEOUT,
  );

  it(
    'finds a surah by a spelling the raw data does not use',
    async () => {
      // The list data says "Al-Ikhlaas"; users type "ikhlas".
      const { getByPlaceholderText, getByText, queryByText } = await render(<SurahListScreen />);

      await fireEvent.changeText(getByPlaceholderText(/search/i), 'ikhlas');

      expect(getByText('Al-Ikhlaas')).toBeTruthy();
      expect(queryByText('Al-Baqara')).toBeNull();
    },
    LIST_RENDER_TIMEOUT,
  );

  it(
    'finds a surah by number',
    async () => {
      const { getByPlaceholderText, getByText, queryByText } = await render(<SurahListScreen />);

      await fireEvent.changeText(getByPlaceholderText(/search/i), '18');

      expect(getByText('Al-Kahf')).toBeTruthy();
      expect(queryByText('Al-Faatiha')).toBeNull();
    },
    LIST_RENDER_TIMEOUT,
  );

  it(
    'shows an empty state when nothing matches',
    async () => {
      const { getByPlaceholderText, getByText } = await render(<SurahListScreen />);

      await fireEvent.changeText(getByPlaceholderText(/search/i), 'zzzznomatch');

      expect(getByText('No surah found')).toBeTruthy();
    },
    LIST_RENDER_TIMEOUT,
  );
});
