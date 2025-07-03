import React from "react";
import {
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper
} from "@mui/material";

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
  setSelectedAirlines
}) => {
  const handleCheckboxChange = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelected(prev =>
      checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #ddd" }}>
      <Typography variant="h6" gutterBottom>
        Filter Results
      </Typography>

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
                onChange={handleCheckboxChange(time, selectedTimes, setSelectedTimes)}
              />
            }
            label={time}
          />
        ))}
      </FormGroup>

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
                onChange={handleCheckboxChange(stop, selectedStops, setSelectedStops)}
              />
            }
            label={stop}
          />
        ))}
      </FormGroup>

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
                onChange={handleCheckboxChange(airline, selectedAirlines, setSelectedAirlines)}
              />
            }
            label={airline}
          />
        ))}
      </FormGroup>
    </Paper>
  );
};

export default SidebarFilters;
