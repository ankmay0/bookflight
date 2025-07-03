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
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FilterListIcon from "@mui/icons-material/FilterList";

import SidebarFilters from "./SidebarFilters";

const FlightSearchResults: React.FC = () => {
  const [priceRange, setPriceRange] = useState<number[]>([200, 1500]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [flights, setFlights] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/ankmay0/bookflight/main/Data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch flight data");
        return res.json();
      })
      .then((data) => setFlights(data))
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  const parseHour = (time: string): number => {
    const [hhmm, meridian] = time.split(" ");
    let [hour, minute] = hhmm.split(":").map(Number);
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;
    return hour + minute / 60;
  };

  const filteredFlights = flights.filter((flight) => {
    if (flight.price < priceRange[0] || flight.price > priceRange[1]) return false;
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false;
    if (selectedStops.length > 0 && !selectedStops.some((stop) => flight.stops.includes(stop))) return false;

    if (selectedTimes.length > 0) {
      const hour = parseHour(flight.departure);
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

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9" }}>
      <Grid container spacing={4}>
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

        <Grid item xs={12} md={9}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">{filteredFlights.length} flights found</Typography>
            <Stack direction="row" spacing={2}>
              <FormControl size="small">
                <InputLabel>Sort by</InputLabel>
                <Select defaultValue="best" label="Sort by">
                  <MenuItem value="best">Best Value</MenuItem>
                  <MenuItem value="priceLow">Price: Low to High</MenuItem>
                  <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<FilterListIcon />}>
                Filters
              </Button>
            </Stack>
          </Box>

          <Stack spacing={3}>
            {filteredFlights.map((flight, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box flex={1} sx={{ minWidth: 160 }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                    {flight.airline}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.flightNumber} • {flight.aircraft}
                  </Typography>
                </Box>

                <Box textAlign="center" sx={{ minWidth: 120 }}>
                  <FlightTakeoffIcon sx={{ mb: 0.5 }} color="primary" />
                  <Typography variant="h6" mb={0.5}>
                    {flight.departure}
                  </Typography>
                  <Typography variant="caption">{flight.from}</Typography>
                </Box>

                <Box textAlign="center" sx={{ minWidth: 120 }}>
                  <ScheduleIcon sx={{ mb: 0.5 }} color="action" />
                  <Typography variant="body1" mb={0.5}>
                    {flight.duration}
                  </Typography>
                  <Chip label={flight.stops} size="small" sx={{ mt: 0.5, bgcolor: "#e0e0e0" }} />
                </Box>

                <Box textAlign="center" sx={{ minWidth: 120 }}>
                  <FlightLandIcon sx={{ mb: 0.5 }} color="secondary" />
                  <Typography variant="h6" mb={0.5}>
                    {flight.arrival}
                  </Typography>
                  <Typography variant="caption">{flight.to}</Typography>
                </Box>

                <Box textAlign="center" sx={{ minWidth: 100 }}>
                  <AttachMoneyIcon color="success" />
                  <Typography variant="h6" mb={0.5}>
                    ${flight.price}
                  </Typography>
                  <Typography variant="caption">per person</Typography>
                </Box>

                <Box sx={{ minWidth: 140 }}>
                  <Button variant="contained" color="primary" sx={{ textTransform: "none" }} fullWidth>
                    Select
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightSearchResults;
