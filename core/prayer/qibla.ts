// Qibla direction — the great-circle initial bearing from a location to the Kaaba. Pure math,
// testable, no dependencies. Degrees clockwise from true North.

const KAABA = { lat: 21.4225, lng: 39.8262 };
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function qiblaBearing(lat: number, lng: number): number {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA.lat);
  const dLng = toRad(KAABA.lng - lng);
  const y = Math.sin(dLng) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
