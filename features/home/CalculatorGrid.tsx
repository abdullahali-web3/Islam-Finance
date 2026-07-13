import { View } from 'react-native';
import { CALCULATORS } from './registry';
import { CalculatorCard } from './CalculatorCard';

/**
 * The home hub's calculator grid (ADR 0006). Renders every registry entry as a two-column grid of
 * cards. Reads only the registry — adding a calculator adds a card here automatically.
 */
export function CalculatorGrid() {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {CALCULATORS.map((item) => (
        <View key={item.id} className="w-[48%]">
          <CalculatorCard item={item} />
        </View>
      ))}
    </View>
  );
}
