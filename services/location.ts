import * as Location from 'expo-location';

/**
 * Foreground location for prayer times + qibla. Requests permission at the moment the user asks for
 * their location (never at startup). Returns null if denied/unavailable — the app stays usable
 * (the last cached location, or a manual note, is used instead).
 */
export async function getCurrentCoords(): Promise<{ lat: number; lng: number } | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    return null;
  }
}
