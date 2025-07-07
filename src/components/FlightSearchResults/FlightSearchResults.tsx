import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useMediaQuery,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FilterListIcon from "@mui/icons-material/FilterList";
import SidebarFilters from "./SidebarFilters";
import { useLocation } from "react-router-dom";

// Type for flight data
interface Trip {
  from: string;
  to: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
}

interface Flight {
  oneWay: boolean;
  seatsAvailable: number;
  currencyCode: string;
  basePrice: string;
  totalPrice: string;
  stops: number;
  trips: Trip[];
}

interface LocationState {
  tripType?: string;
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: number;
}

const FlightSearchResults: React.FC = () => {
  const [priceRange, setPriceRange] = useState<number[]>([200, 150000]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("best");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const state = location.state as LocationState || {};

  const { from, to, departDate, passengers } = state;

  useEffect(() => {
    if (!from || !to || !departDate || !passengers) return;

    const url = `http://localhost:8080/flights/search?originLocationCode=${from}&destinationLocationCode=${to}&departureDate=${departDate}&adults=${passengers}&currencyCode=INR`;

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch flight data");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFlights(data);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setError("Failed to load flights.");
        setLoading(false);
      });
  }, [from, to, departDate, passengers]);

  const parseHour = (time: string): number => {
    try {
      const date = new Date(`1970-01-01T${time}`);
      return date.getHours() + date.getMinutes() / 60;
    } catch {
      return 0;
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const price = parseFloat(flight.totalPrice || flight.basePrice || "0");
    const airlineList = flight.trips.map((t) => t.airline);

    if (price < priceRange[0] || price > priceRange[1]) return false;
    if (selectedAirlines.length > 0 && !selectedAirlines.some((a) => airlineList.includes(a)))
      return false;
    if (
      selectedStops.length > 0 &&
      !selectedStops.some((stop) => stop === `${flight.stops}`)
    )
      return false;

    if (selectedTimes.length > 0) {
      const hour = parseHour(flight.trips[0].departureTime);
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

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    const priceA = parseFloat(a.totalPrice || a.basePrice || "0");
    const priceB = parseFloat(b.totalPrice || b.basePrice || "0");

    if (sortBy === "priceLow") return priceA - priceB;
    if (sortBy === "priceHigh") return priceB - priceA;
    return 0;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9f9f9" }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        gap={2}
      >
        <Typography variant="h6">
          {loading ? "Loading flights..." : `${filteredFlights.length} flights found`}
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="best">Best Value</MenuItem>
              <MenuItem value="priceLow">Price: Low to High</MenuItem>
              <MenuItem value="priceHigh">Price: High to Low</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Stack>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {showFilters && (
          <Grid item xs={12} md={3}>
            <SidebarFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
              selectedStops={selectedStops}
              setSelectedStops={setSelectedStops}
              selectedAirlines={selectedAirlines}
              setSelectedAirlines={setSelectedAirlines}
            />
          </Grid>
        )}

        <Grid item xs={12} md={showFilters ? 9 : 12}>
          <Stack spacing={3}>
            {sortedFlights.map((flight, index) => {
              const firstTrip = flight.trips[0];
              const lastTrip = flight.trips[flight.trips.length - 1];
              const price = parseFloat(flight.totalPrice || flight.basePrice || "0");

              return (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #ddd",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Airline Info */}
                  <Box flex={1} sx={{ minWidth: 140 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                      {firstTrip.airline}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {firstTrip.flightNumber} • {firstTrip.aircraft}
                    </Typography>
                  </Box>

                  {/* Departure */}
                  <Box textAlign="center" sx={{ minWidth: 110 }}>
                    <FlightTakeoffIcon sx={{ mb: 0.5 }} color="primary" />
                    <Typography variant="h6">{firstTrip.departureTime}</Typography>
                    <Typography variant="caption">{firstTrip.from}</Typography>
                  </Box>

                  {/* Duration + stops */}
                  {/* <Box textAlign="center" sx={{ minWidth: 110 }}>
                    <ScheduleIcon sx={{ mb: 0.5 }} color="action" />
                    <Typography variant="body1">{firstTrip.duration}</Typography>
                    <Chip label={`${flight.stops} stop(s)`} size="small" sx={{ mt: 0.5, bgcolor: "#e0e0e0" }} />
                  </Box> */}

                  {/* Arrival */}
                  <Box textAlign="center" sx={{ minWidth: 110 }}>
                    <FlightLandIcon sx={{ mb: 0.5 }} color="secondary" />
                    <Typography variant="h6">{lastTrip.arrivalTime}</Typography>
                    <Typography variant="caption">{lastTrip.to}</Typography>
                  </Box>

                  {/* Price */}
                  <Box textAlign="center" sx={{ minWidth: 100 }}>
                    <AttachMoneyIcon color="success" />
                    <Typography variant="h6">₹{price}</Typography>
                    <Typography variant="caption">per person</Typography>
                  </Box>

                  {/* Book Button */}
                  <Box sx={{ minWidth: 130 }}>
                    <Button variant="contained" color="primary" fullWidth sx={{ textTransform: "none" }}>
                      Select
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightSearchResults;
