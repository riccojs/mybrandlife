export interface GPSData {
  gpsLat: number | null;
  gpsLan: number | null;
  gpsAccuracy: number | null;
  gpsTimestamp: number | null;
  gpsConsent: boolean;
}

export function useGPS() {
  const requestGPS = () =>
    new Promise<GPSData>((resolve) => {
      if (!("geolocation" in navigator)) {
        resolve({
          gpsLat: null,
          gpsLan: null,
          gpsAccuracy: null,
          gpsTimestamp: null,
          gpsConsent: false,
        });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data: GPSData = {
            gpsLat: position.coords.latitude,
            gpsLan: position.coords.longitude,
            gpsAccuracy: position.coords.accuracy,
            gpsTimestamp: position.timestamp,
            gpsConsent: true,
          };
          resolve(data);
        },
        () => {
          const data: GPSData = {
            gpsLat: null,
            gpsLan: null,
            gpsAccuracy: null,
            gpsTimestamp: null,
            gpsConsent: false,
          };
          resolve(data);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    });
  return { requestGPS };
}
