// Guards the CC BY attribution surface at the UI layer.
//
// Why this test exists specifically: independent QA found the attribution was rendered as
// `surahs.length > 0 ? <AttributionNotice/> : null`, so searching for something with no matches made
// the Tanzil source and link vanish. Nothing caught it, because core/quran's 25 tests all stop at the
// data layer. ADR 0016 makes a visible attribution surface a licence condition — the app's right to
// bundle the mushaf depends on it — so it needs a guard that fails if a future refactor drops it.

import { describe, it, expect, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { QURAN_ATTRIBUTION } from '@/core/quran';
import { AttributionNotice } from '../AttributionNotice';
import { SurahListScreen } from '../SurahListScreen';
import { SurahReaderScreen } from '../SurahReaderScreen';
import { renderWithSafeArea as render } from '../testUtils';

jest.mock('@/services/storage'); // in-memory stand-in — the list pulls in the MMKV-backed store
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('AttributionNotice', () => {
  it('shows the tanzil.net source URL as a tappable link', async () => {
    const { getByText } = await render(<AttributionNotice />);
    expect(getByText('https://tanzil.net')).toBeTruthy();
  });

  it('opens the source URL when tapped — the link the licence is conditioned on', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const { getByText } = await render(<AttributionNotice />);

    await fireEvent.press(getByText('https://tanzil.net'));
    expect(openURL).toHaveBeenCalledWith('https://tanzil.net');
    openURL.mockRestore();
  });

  it('does not reject unhandled when no app can open the link', async () => {
    // openURL rejects on a device with no browser; the URL text must still be on screen so the
    // source stays "clearly indicated" either way.
    const openURL = jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('no handler'));
    const { getByText } = await render(<AttributionNotice />);

    await fireEvent.press(getByText('https://tanzil.net'));
    expect(getByText('https://tanzil.net')).toBeTruthy();
    openURL.mockRestore();
  });
});

describe('attribution is unconditional on the surah list', () => {
  // Rendering SurahListScreen mounts a 114-item FlatList; in jsdom under full-suite CPU contention
  // that legitimately exceeds the default 5s (it's ~3.5s in isolation). Correctness isn't in doubt —
  // the isolated run is green — so these get explicit headroom rather than a brittle default.
  const LIST_RENDER_TIMEOUT = 20000;

  it(
    'renders with results present',
    async () => {
      const { getAllByText } = await render(<SurahListScreen />);
      expect(getAllByText('https://tanzil.net').length).toBeGreaterThan(0);
    },
    LIST_RENDER_TIMEOUT,
  );

  it(
    'still renders when a search matches nothing (the regression)',
    async () => {
      const { getByPlaceholderText, getAllByText, getByText } = await render(<SurahListScreen />);

      await fireEvent.changeText(getByPlaceholderText(/search/i), 'zzzznomatch');

      expect(getByText('No surah found')).toBeTruthy();
      expect(getAllByText('https://tanzil.net').length).toBeGreaterThan(0);
    },
    LIST_RENDER_TIMEOUT,
  );
});

describe('attribution on the reader', () => {
  it('renders without scrolling past the surah', async () => {
    // Al-Baqara: 286 ayat. As a ListFooterComponent the notice was unreachable in practice.
    const { getAllByText } = await render(<SurahReaderScreen surah={2} />);
    expect(getAllByText('https://tanzil.net').length).toBeGreaterThan(0);
  });

  it('names the edition and licence', async () => {
    const { getByText } = await render(<SurahReaderScreen surah={1} />);
    expect(getByText(/Tanzil Uthmani/)).toBeTruthy();
    expect(getByText(/CC BY 3\.0/)).toBeTruthy();
  });

  it('exposes the licence values the notice depends on', () => {
    expect(QURAN_ATTRIBUTION.source).toBe('https://tanzil.net');
    expect(QURAN_ATTRIBUTION.license).toBe('CC BY 3.0');
  });
});
