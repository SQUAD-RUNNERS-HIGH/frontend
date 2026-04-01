export const convertSpeedToPace = (speed: number) => {
    if (!speed) return "00'00\"";
    if (speed <= 0) return "00'00\"";

    // m/s → km/h
    const kmPerHour = speed * 3.6;

    // km/h → 분/km
    const minutesPerKm = 60 / kmPerHour;
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);

    // 두 자리 수 형식으로 맞춤
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedMinutes}'${paddedSeconds}"`;
  };

export const calculatePaceFromDistance = (distance: number, seconds: number): string => {
  if (!distance || !seconds || distance <= 0 || seconds <= 0) {
    return "00'00\"";
  }

  const speedMs = distance / seconds; // m/s
  const kmPerHour = speedMs * 3.6;
  const minutesPerKm = 60 / kmPerHour;

  const minutes = Math.floor(minutesPerKm);
  const secs = Math.round((minutesPerKm - minutes) * 60);

  return `${String(minutes).padStart(2, "0")}'${String(secs).padStart(2, "0")}"`;
};