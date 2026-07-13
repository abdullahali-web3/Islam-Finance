import type { ReactNode } from 'react';
import { View, Pressable } from 'react-native';

type CardProps = {
  children: ReactNode;
  /** When provided, the card becomes a button with a 44pt-min hit target. */
  onPress?: () => void;
  /** Required for a screen reader when the whole card is pressable. */
  accessibilityLabel?: string;
  /** Extra NativeWind classes appended to the token-driven base. */
  className?: string;
};

const BASE =
  'rounded-lg border border-neutral-100 bg-neutral-0 p-4 dark:border-neutral-700 dark:bg-neutral-900';

/**
 * Surface primitive (ADR 0012). Token-driven, light + dark. Use as the base container for any
 * grouped content or as a tappable card (pass `onPress`). Never hardcode surface colors elsewhere —
 * compose this instead.
 */
export function Card({ children, onPress, accessibilityLabel, className = '' }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={`${BASE} min-h-[44px] active:opacity-80 ${className}`}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={`${BASE} ${className}`}>{children}</View>;
}
