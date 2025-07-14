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
  useMediaQuery,
  CircularProgress,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SidebarFilters from "./SidebarFilters";
import { useLocation, useNavigate } from "react-router-dom";
import { Flight, LocationState } from "../Types/FlightTypes";



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



  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as LocationState) || {};
  const { from, to, departDate, passengers } = state;


  const mapStopsToLabel = (stops: number) => {
    if (stops === 0) return "Nonstop";
    if (stops === 1) return "1 Stop";
    return "2+ Stops";
  };


  useEffect(() => {
    if (!from || !to || !departDate || !passengers) return;

    const url = `http://localhost:8080/flights/search?originLocationCode=${from}&destinationLocationCode=${to}&departureDate=${departDate}&adults=${passengers}&currencyCode=INR`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch flight data");
        return res.json();
      })
      .then((data: Flight[]) => {
        setFlights(data);
        setFilteredFlights(data);

        const prices = data.map(f => parseFloat(f.totalPrice || f.basePrice || "0"));
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        setMinPrice(min);
        setMaxPrice(max);

        const stopsSet = new Set<string>();
        const airlinesSet = new Set<string>();

        data.forEach((flight) => {
          stopsSet.add(mapStopsToLabel(flight.trips[0].stops));
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
        setLoading(false);
      });
  }, [from, to, departDate, passengers]);

  useEffect(() => {
    let updated = flights.filter((flight) => {
      const price = parseFloat(flight.totalPrice || flight.basePrice || "0");
      const airlineList = flight.trips.flatMap((t) => t.legs.map((l) => l.operatingCarrierCode));

      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (selectedAirlines.length > 0 && !selectedAirlines.some((a) => airlineList.includes(a))) return false;
      if (selectedStops.length > 0 && !selectedStops.includes(mapStopsToLabel(flight.trips[0].stops))) return false;



      if (selectedTimes.length > 0) {
        const hour = new Date(flight.trips[0].legs[0].departureDateTime).getHours();
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
      updated = updated.sort((a, b) => parseFloat(a.totalPrice) - parseFloat(b.totalPrice));
    } else if (sortBy === "priceHigh") {
      updated = updated.sort((a, b) => parseFloat(b.totalPrice) - parseFloat(a.totalPrice));
    }

    setFilteredFlights(updated);
    
  }, [priceRange, selectedTimes, selectedStops, selectedAirlines, sortBy, flights]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#eef2f5" }}>
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mb={3} gap={2}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AirplanemodeActiveIcon color="primary" />
          {loading ? "Loading flights..." : `${filteredFlights.length} flights found`}
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
              availableStops={availableStops}
              availableAirlines={availableAirlines}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />


          </Grid>
        )}

        <Grid item xs={12} md={showFilters ? 9 : 12}>
          {loading ? (
            <CircularProgress />
          ) : filteredFlights.length === 0 ? (
            <Typography>No flights found.</Typography>
          ) : (
            <Stack spacing={3}>
              {filteredFlights.map((flight, idx) => (
                <Paper
                  key={idx}
                  elevation={4}
                  sx={{ borderRadius: 3, p: 3, backgroundColor: "#ffffff", boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" }}
                >
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AirplanemodeActiveIcon /> {flight.trips[0].legs[0].operatingCarrierCode} {flight.trips[0].legs[0].flightNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {flight.trips.length > 1 ? "Multiple Trips" : "Direct"} | ₹{flight.totalPrice}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" size="small" onClick={() => navigate("/passenger-details", { state: { flight , passengers} })}>
                        Select
                        
                      </Button>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {flight.trips.map((trip, tIdx) => (
                    <Box key={tIdx}>
                      {trip.legs.map((leg, lIdx) => (
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between" key={lIdx} sx={{ mb: 1 }}>
                          <Grid item xs={12} md={3}>
                            <Typography>
                              <FlightTakeoffIcon fontSize="small" sx={{ mr: 1 }} />
                              <strong>{new Date(leg.departureDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong> ({leg.departureAirport})
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography>
                              <FlightLandIcon fontSize="small" sx={{ mr: 1 }} />
                              <strong>{new Date(leg.arrivalDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong> ({leg.arrivalAirport})
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />{leg.duration}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography>
                              <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />Aircraft: {leg.aircraftCode}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  ))}
                </Paper>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightSearchResults;
