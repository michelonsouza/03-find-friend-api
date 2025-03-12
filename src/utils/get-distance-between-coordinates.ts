export interface Coordinate {
  latitude: number;
  longitude: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
  format: 'km' | 'm' = 'km',
): number {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0;
  }

  /* v8 ignore next 1 */
  const earthRadius = format === 'km' ? 6371 : 6371e3; // km or m `6371e3 = 6371000`
  const φ1 = toRadians(from.latitude); // φ1 (phi 1) (latitude of "from" point in radians)
  const φ2 = toRadians(to.latitude); // φ2 (phi 1) (latitude of "to" point in radians)
  const Δφ = toRadians(to.latitude - from.latitude); // Δφ (delta phi) Difference in latitudes
  const Δλ = toRadians(to.longitude - from.longitude); // Δλ (delta lambda) Difference in longitudes

  const distance =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2); // haversine formula

  const centralAngle =
    2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1 - distance)); // central angle between two points

  return earthRadius * centralAngle; // distance in meters or kilometers
}
