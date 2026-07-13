import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type OfflineNoticeProps = {
  /** Already-translated message, e.g. "Offline — showing your last saved price." */
  message: string;
};

/**
 * Inline offline banner (ADR 0012). Signals that data shown is a cached/offline fallback (e.g. the
 * gold/silver price per ADR 0008). Announced via the `alert` role. Token-driven, light + dark.
 */
export function OfflineNotice({ message }: OfflineNoticeProps) {
  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-center gap-2 rounded-md border border-gold-500 bg-gold-100 px-3 py-2"
    >
      <Ionicons name="cloud-offline-outline" size={16} color="#A97D14" />
      <Text className="flex-1 text-xs text-gold-600">{message}</Text>
    </View>
  );
}
