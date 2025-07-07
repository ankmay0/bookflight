import axios from "axios";
import debounce from "lodash.debounce";

/**
 * Calculates the distance between two coordinates using the Haversine formula.
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
    const res = await axios.get(`http://localhost:8080/locations/search?keyword=${keyword}`);
    const data = res.data;

    const formattedOptions: any[] = [];

    data.forEach((item: any) => {
      if (item.subType === "CITY") {
        const cityName = item.name || `${item.iata} Metropolitan Area`;
        formattedOptions.push({
          label: `${cityName} (${item.iata})`,
          value: item.iata,
          isParent: true,
          displayText: `${cityName} (${item.iata})`,
        });

        if (item.groupData && Array.isArray(item.groupData)) {
          item.groupData.forEach((airport: any) => {
            const cityInfo = airport.city ? `, ${airport.city}` : "";
            const distance = haversineDistance(
              item.latitude,
              item.longitude,
              airport.latitude,
              airport.longitude
            ).toFixed(1);

            formattedOptions.push({
              label: `${airport.name} (${airport.iata})${cityInfo} — ${distance} km`,
              value: airport.iata,
              isChild: true,
              displayText: `${airport.name} (${airport.iata})`,
              distance: `${distance} km`,
            });
          });
        }
      } else if (item.subType === "AIRPORT") {
        const cityInfo = item.city ? `, ${item.city}` : "";
        formattedOptions.push({
          label: `${item.name} (${item.iata})${cityInfo}`,
          value: item.iata,
          isChild: false,
          displayText: `${item.name} (${item.iata})`,
        });
      }
    });

    setOptions(formattedOptions);
  } catch (error) {
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
