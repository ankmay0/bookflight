import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FilterListIcon from "@mui/icons-material/FilterList";

const FlightSearchResults = () => {
  const [priceRange, setPriceRange] = useState<number[]>([200, 1500]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const flights = [
    {
      airline: "American Airlines",
      flightNumber: "AA 140",
      aircraft: "Boeing 777",
      departure: "8:15 AM",
      arrival: "4:00 PM",
      duration: "7h 45m",
      price: "$720",
      stops: "Nonstop",
      from: "JFK (New York)",
      to: "LHR (London)"
    },
    {
      airline: "Delta Airlines",
      flightNumber: "DL 150",
      aircraft: "Airbus A330",
      departure: "11:30 AM",
      arrival: "7:45 PM",
      duration: "8h 15m",
      price: "$680",
      stops: "Nonstop",
      from: "JFK (New York)",
      to: "LHR (London)"
    },
    {
      airline: "United Airlines",
      flightNumber: "UA 98",
      aircraft: "Boeing 787",
      departure: "2:45 PM",
      arrival: "1:15 PM +1",
      duration: "10h 30m",
      price: "$595",
      stops: "1 stop in DUB",
      from: "JFK (New York)",
      to: "LHR (London)"
    }
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9" }}>
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #ddd" }}>
            <Typography variant="h6" gutterBottom>
              Filter Results
            </Typography>

            {/* Price Slider */}
            <Typography gutterBottom sx={{ mt: 2 }}>
              Price Range (${priceRange[0]} - ${priceRange[1]})
            </Typography>
            <Slider
              value={priceRange}
              onChange={(_, value) => setPriceRange(value as number[])}
              min={200}
              max={1500}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            {/* Departure Time */}
            <Typography variant="subtitle1" gutterBottom>
              Departure Time
            </Typography>
            <FormGroup>
              {["Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-12AM)"].map((time) => (
                <FormControlLabel
                  key={time}
                  control={
                    <Checkbox
                      checked={selectedTimes.includes(time)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedTimes((prev) =>
                          checked ? [...prev, time] : prev.filter((t) => t !== time)
                        );
                      }}
                    />
                  }
                  label={time}
                />
              ))}
            </FormGroup>

            {/* Stops */}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Stops
            </Typography>
            <FormGroup>
              {["Nonstop", "1 Stop", "2+ Stops"].map((stop) => (
                <FormControlLabel
                  key={stop}
                  control={
                    <Checkbox
                      checked={selectedStops.includes(stop)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedStops((prev) =>
                          checked ? [...prev, stop] : prev.filter((s) => s !== stop)
                        );
                      }}
                    />
                  }
                  label={stop}
                />
              ))}
            </FormGroup>

            {/* Airlines */}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Airlines
            </Typography>
            <FormGroup>
              {["American Airlines", "Delta Airlines", "United Airlines"].map((airline) => (
                <FormControlLabel
                  key={airline}
                  control={
                    <Checkbox
                      checked={selectedAirlines.includes(airline)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedAirlines((prev) =>
                          checked ? [...prev, airline] : prev.filter((a) => a !== airline)
                        );
                      }}
                    />
                  }
                  label={airline}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* Flight Results */}
        <Grid item xs={12} md={9}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">147 flights found</Typography>
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

          {/* Beautiful Flight Cards */}
          <Stack spacing={3}>
            {flights.map((flight, index) => (
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
                  gap: 2, // <-- ADD GAP between items
                  flexWrap: "wrap"
                }}
              >
                {/* Airline */}
                <Box flex={1} sx={{ minWidth: 160 }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                    {flight.airline}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.flightNumber} • {flight.aircraft}
                  </Typography>
                </Box>

                {/* Departure */}
                <Box textAlign="center" sx={{ minWidth: 120 }}>
                  <FlightTakeoffIcon sx={{ mb: 0.5 }} color="primary" />
                  <Typography variant="h6" mb={0.5}>
                    {flight.departure}
                  </Typography>
                  <Typography variant="caption">{flight.from}</Typography>
                </Box>

                {/* Duration */}
                <Box textAlign="center" sx={{ minWidth: 120 }}>
                  <ScheduleIcon sx={{ mb: 0.5 }} color="action" />
                  <Typography variant="body1" mb={0.5}>
                    {flight.duration}
                  </Typography>
                  <Chip
                    label={flight.stops}
                    size="small"
                    sx={{ mt: 0.5, bgcolor: "#e0e0e0" }}
                  />
                </Box>

                {/* Arrival */}
                <Box textAlign="center" sx={{ minWidth: 120 }}>
                  <FlightLandIcon sx={{ mb: 0.5 }} color="secondary" />
                  <Typography variant="h6" mb={0.5}>
                    {flight.arrival}
                  </Typography>
                  <Typography variant="caption">{flight.to}</Typography>
                </Box>

                {/* Price */}
                <Box textAlign="center" sx={{ minWidth: 100 }}>
                  <AttachMoneyIcon color="success" />
                  <Typography variant="h6" mb={0.5}>
                    {flight.price}
                  </Typography>
                  <Typography variant="caption">per person</Typography>
                </Box>

                {/* Action */}
                <Box sx={{ minWidth: 140 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "none" }}
                    fullWidth
                  >
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
