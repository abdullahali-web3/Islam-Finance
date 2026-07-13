import { describe, it, expect, jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { ResultView } from '../ResultView';

// Proves ADR 0011's component-test layer (React Native Testing Library) is wired. ResultView is
// purely presentational, so it renders identically here and on device. Note: RNTL v14's render/
// fireEvent are async (they await React's act) — always await them.
describe('ResultView', () => {
  const rows = [
    { label: 'Total wealth', value: '$10,000' },
    { label: 'Nisab', value: '$500' },
    { label: 'Zakat due (2.5%)', value: '$250', emphasis: true },
  ];

  it('renders the headline, breakdown, citation and disclaimer', async () => {
    const { getByText, getAllByText } = await render(
      <ResultView
        headline="$250"
        headlineLabel="Zakat due"
        rows={rows}
        citation="Based on the 2.5% rate on wealth above nisab."
        disclaimer="Not yet scholar-verified."
      />
    );

    // "$250" appears twice: the headline and the emphasized breakdown row.
    expect(getAllByText('$250')).toHaveLength(2);
    expect(getByText('Zakat due')).toBeTruthy();
    expect(getByText('Zakat due (2.5%)')).toBeTruthy();
    expect(getByText(/2.5% rate on wealth above nisab/)).toBeTruthy();
    expect(getByText('Not yet scholar-verified.')).toBeTruthy();
  });

  it('fires action handlers when an action is pressed', async () => {
    const onSave = jest.fn();
    const { getByText } = await render(
      <ResultView
        headline="$250"
        rows={rows}
        citation="cited"
        actions={[{ label: 'Save', onPress: onSave }]}
      />
    );

    await fireEvent.press(getByText('Save'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
