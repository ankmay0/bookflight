import axios from "axios";
import debounce from "lodash.debounce";

/**
 * Calculates the distance between two coordinates using the Haversine formula.
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined
  ) {
    return NaN;
  }
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Fetches location data (city/airport) based on a keyword and formats them for Autocomplete.
 */
export const fetchLocations = async (
  keyword: string,
  setOptions: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (!keyword) {
    setOptions([]);
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:8080/locations/search?keyword=${encodeURIComponent(keyword)}`
    );
    const data = res.data;

    const formattedOptions: any[] = [];

    if (!data.locationResponses || !Array.isArray(data.locationResponses)) {
      setOptions([]); // fallback
      return;
    }

    data.locationResponses.forEach((item: any) => {
      if (item.subType === "CITY") {
        const cityName = item.name || `${item.iata} Metropolitan Area`;
        formattedOptions.push({
          label: `${cityName} (${item.iata})`,
          value: item.iata,
          isParent: true,
          isChild: false,
          displayText: `${cityName} (${item.iata})`,
        });

        // group_data may be undefined:
        if (
          item.group_data &&
          item.group_data.simpleAirports &&
          Array.isArray(item.group_data.simpleAirports)
        ) {
          item.group_data.simpleAirports.forEach((airport: any) => {
            const cityInfo = airport.city ? `, ${airport.city}` : "";
            // Calculate distance if both city and airport have lat/lng
            let distance: string | undefined = undefined;
            if (
              typeof item.latitude === "number" &&
              typeof item.longitude === "number" &&
              typeof airport.latitude === "number" &&
              typeof airport.longitude === "number"
            ) {
              const dist = haversineDistance(
                item.latitude,
                item.longitude,
                airport.latitude,
                airport.longitude
              );
              distance = `${dist.toFixed(1)} km`;
            }
            formattedOptions.push({
              label: `${airport.name} (${airport.iata})${cityInfo}${distance ? ` — ${distance}` : ""}`,
              value: airport.iata,
              isParent: false,
              isChild: true,
              displayText: `${airport.name} (${airport.iata})`,
              distance: distance,
            });
          });
        }
      } else if (item.subType === "AIRPORT") {
        const cityInfo = item.city ? `, ${item.city}` : "";
        formattedOptions.push({
          label: `${item.name} (${item.iata})${cityInfo}`,
          value: item.iata,
          isParent: false,
          isChild: false,
          displayText: `${item.name} (${item.iata})`,
        });
      }
    });

    setOptions(formattedOptions);
  } catch (error) {
    setOptions([]);
    console.error("Failed to fetch locations", error);
  }
};

/**
 * Creates a debounced version of the location fetcher.
 */
export const createDebouncedFetcher = (
  fetcher: (keyword: string) => void,
  delay: number = 400
) => {
  return debounce(fetcher, delay);
};
