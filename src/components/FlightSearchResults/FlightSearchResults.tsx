import React, { useState, useEffect } from "react";
import { Box, Stack, FormControl, InputLabel, Select, MenuItem, Button, Typography, useMediaQuery, CircularProgress } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { useLocation, useNavigate } from "react-router-dom";
import { Flight, LocationState } from "../Types/FlightTypes";
import Lottie from "lottie-react";
import SidebarFilters from "./SidebarFilters";
import FlightList from "./FlightList";

const FlightSearchResults: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("best");
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<number[]>([200, 150000]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [availableStops, setAvailableStops] = useState<string[]>([]);
  const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [lottieJson, setLottieJson] = useState<any>(null);
  const [selectedDepartureFlight, setSelectedDepartureFlight] = useState<Flight | null>(null);

  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) || {};
  const { from, to, departDate, returnDate, adults, children } = state;

  const mapStopsToLabel = (stops: number | undefined) => {
    if (stops === 0) return "Nonstop";
    if (stops === 1) return "1 Stop";
    if (stops && stops > 1) return "2+ Stops";
    return "Unknown";
  };

  useEffect(() => {
    fetch("/animation.json")
      .then(resp => resp.json())
      .then(setLottieJson)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!from || !to || !departDate || (!adults && !children)) return;

    const adt = adults || 0;
    const chd = children || 0;
    let url = `http://localhost:8080/flights/search?originLocationCode=${from}&destinationLocationCode=${to}&departureDate=${departDate}&currencyCode=INR`;
    if (adt) url += `&adults=${adt}`;
    if (chd) url += `&children=${chd}`;
    if (returnDate) url += `&returnDate=${returnDate}`;

    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch flight data");
        return res.json();
      })
      .then((data) => {
        let flightsArr: Flight[] = Array.isArray(data.flightsAvailable) ? data.flightsAvailable : [];
        setFlights(flightsArr);
        setFilteredFlights(flightsArr);

        const prices = flightsArr.map(f => parseFloat(f.totalPrice || f.basePrice || "0") || 0);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(isFinite(min) ? min : 0);
        setMaxPrice(isFinite(max) ? max : 0);

        const stopsSet = new Set<string>();
        const airlinesSet = new Set<string>();

        flightsArr.forEach((flight) => {
          const stopsLabel = mapStopsToLabel(flight.trips?.[0]?.stops);
          stopsSet.add(stopsLabel);
          flight.trips.forEach((trip) =>
            trip.legs.forEach((leg) => airlinesSet.add(leg.operatingCarrierCode))
          );
        });

        setAvailableStops(Array.from(stopsSet));
        setAvailableAirlines(Array.from(airlinesSet));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setFlights([]);
        setFilteredFlights([]);
        setLoading(false);
      });
  }, [from, to, departDate, returnDate, adults, children]);

  useEffect(() => {
    let updated = flights.filter((flight) => {
      const price = parseFloat(flight.totalPrice || flight.basePrice || "0") || 0;
      const airlineList = flight.trips.flatMap((t) =>
        t.legs.map((l) => l.operatingCarrierCode)
      );

      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (selectedAirlines.length > 0 && !selectedAirlines.some((a) => airlineList.includes(a))) return false;
      if (selectedStops.length > 0 && !selectedStops.includes(mapStopsToLabel(flight.trips?.[0]?.stops))) return false;

      if (selectedTimes.length > 0) {
        const firstLeg = flight.trips?.[0]?.legs?.[0];
        if (!firstLeg) return false;
        const hour = new Date(firstLeg.departureDateTime).getHours();
        const matchTime = selectedTimes.some((time) => {
          if (time.includes("Morning")) return hour >= 6 && hour < 12;
          if (time.includes("Afternoon")) return hour >= 12 && hour < 18;
          if (time.includes("Evening")) return hour >= 18 && hour < 24;
          return false;
        });
        if (!matchTime) return false;
      }
      return true;
    });

    if (sortBy === "priceLow") {
      updated = [...updated].sort(
        (a, b) => (parseFloat(a.totalPrice) || 0) - (parseFloat(b.totalPrice) || 0)
      );
    } else if (sortBy === "priceHigh") {
      updated = [...updated].sort(
        (a, b) => (parseFloat(b.totalPrice) || 0) - (parseFloat(a.totalPrice) || 0)
      );
    }
    setFilteredFlights(Array.isArray(updated) ? updated : []);
  }, [priceRange, selectedTimes, selectedStops, selectedAirlines, sortBy, flights]);

  const handleDepartureSelect = (flight: Flight) => {
    setSelectedDepartureFlight(flight);
  };

  const handleConfirmSelection = (returnFlight: Flight) => {
    navigate("/passenger-details", { 
      state: { 
        flight: { 
          ...selectedDepartureFlight, 
          trips: [selectedDepartureFlight!.trips[0], returnFlight.trips[1]] 
        }, 
        passengers: (adults || 0) + (children || 0) 
      }
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#eef2f5" }}>
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mb={3} gap={2}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AirplanemodeActiveIcon color="primary" />
          {loading ? "Loading flights..." : selectedDepartureFlight ? `${filteredFlights.filter(f => f.trips[1]?.from === to && f.trips[1]?.to === from).length} return flights found` : `${filteredFlights.filter(f => f.trips[0]?.from === from && f.trips[0]?.to === to).length} departure flights found`}
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="best">Best Value</MenuItem>
              <MenuItem value="priceLow">Price: Low to High</MenuItem>
              <MenuItem value="priceHigh">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setShowFilters((prev) => !prev)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Stack>
      </Box>
      <FlightList
        loading={loading}
        lottieJson={lottieJson}
        filteredFlights={filteredFlights}
        selectedDepartureFlight={selectedDepartureFlight}
        from={from}
        to={to}
        showFilters={showFilters}
        handleDepartureSelect={handleDepartureSelect}
        handleConfirmSelection={handleConfirmSelection}
        mapStopsToLabel={mapStopsToLabel}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedTimes={selectedTimes}
        setSelectedTimes={setSelectedTimes}
        selectedStops={selectedStops}
        setSelectedStops={setSelectedStops}
        selectedAirlines={selectedAirlines}
        setSelectedAirlines={setSelectedAirlines}
        availableStops={availableStops}
        availableAirlines={availableAirlines}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setSelectedDepartureFlight={setSelectedDepartureFlight}
      />
    </Box>
  );
};

export default FlightSearchResults;