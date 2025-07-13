import React from "react";
import {
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import FlightIcon from "@mui/icons-material/Flight";

interface SidebarFiltersProps {
  priceRange: number[];
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTimes: string[];
  setSelectedTimes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStops: string[];
  setSelectedStops: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAirlines: string[];
  setSelectedAirlines: React.Dispatch<React.SetStateAction<string[]>>;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  priceRange,
  setPriceRange,
  selectedTimes,
  setSelectedTimes,
  selectedStops,
  setSelectedStops,
  selectedAirlines,
  setSelectedAirlines,
}) => {
  const handleCheckboxChange = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelected((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 4, border: "1px solid #ccc", bgcolor: "#fafafa" }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FilterAltIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Filter Results
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box mb={3}>
        <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1 }} gutterBottom>
          <AttachMoneyIcon fontSize="small" /> Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, value) => setPriceRange(value as number[])}
          min={200}
          max={1500}
          valueLabelDisplay="auto"
        />
        <Chip label={`₹${priceRange[0]} - ₹${priceRange[1]}`} size="small" color="primary" />
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1 }} gutterBottom>
          <AccessTimeIcon fontSize="small" /> Departure Time
        </Typography>
        <FormGroup>
          {["Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-12AM)"].map((time) => (
            <FormControlLabel
              key={time}
              control={
                <Checkbox
                  checked={selectedTimes.includes(time)}
                  onChange={handleCheckboxChange(time, selectedTimes, setSelectedTimes)}
                />
              }
              label={time}
            />
          ))}
        </FormGroup>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1 }} gutterBottom>
          <ConnectingAirportsIcon fontSize="small" /> Stops
        </Typography>
        <FormGroup>
          {["Nonstop", "1 Stop", "2+ Stops"].map((stop) => (
            <FormControlLabel
              key={stop}
              control={
                <Checkbox
                  checked={selectedStops.includes(stop)}
                  onChange={handleCheckboxChange(stop, selectedStops, setSelectedStops)}
                />
              }
              label={stop}
            />
          ))}
        </FormGroup>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1 }} gutterBottom>
          <FlightIcon fontSize="small" /> Airlines
        </Typography>
        <FormGroup>
          {["American Airlines", "Delta Airlines", "United Airlines"].map((airline) => (
            <FormControlLabel
              key={airline}
              control={
                <Checkbox
                  checked={selectedAirlines.includes(airline)}
                  onChange={handleCheckboxChange(airline, selectedAirlines, setSelectedAirlines)}
                />
              }
              label={airline}
            />
          ))}
        </FormGroup>
      </Box>
    </Paper>
  );
};

export default SidebarFilters;