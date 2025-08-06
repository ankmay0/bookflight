import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FlightTakeoff, FlightLand, CalendarToday, Person, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchLocations, createDebouncedFetcher } from "../utils/utils";

const FlightSearch: React.FC = () => {
  const [tripType, setTripType] = useState("round");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [fromOptions, setFromOptions] = useState<any[]>([]);
  const [toOptions, setToOptions] = useState<any[]>([]);
  const [fromInputValue, setFromInputValue] = useState("");
  const [toInputValue, setToInputValue] = useState("");
  const [isFromLoading, setIsFromLoading] = useState(false);
  const [isToLoading, setIsToLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const debouncedFromFetch = useMemo(
    () =>
      createDebouncedFetcher((keyword) => {
        console.log("Debounced fetch for 'From':", keyword);
        fetchLocations(keyword, setFromOptions, setIsFromLoading, setError);
      }, 200),
    []
  );

  const debouncedToFetch = useMemo(
    () =>
      createDebouncedFetcher((keyword) => {
        console.log("Debounced fetch for 'To':", keyword);
        fetchLocations(keyword, setToOptions, setIsToLoading, setError);
      }, 200),
    []
  );

  useEffect(() => {
    console.log("From Options:", JSON.stringify(fromOptions, null, 2));
    console.log("To Options:", JSON.stringify(toOptions, null, 2));
  }, [fromOptions, toOptions]);

  const validateInputs = () => {
    if (!from || !to) {
      setError("Please select both 'From' and 'To' locations.");
      return false;
    }
    if (!departDate) {
      setError("Please select a departure date.");
      return false;
    }
    if (tripType === "round" && !returnDate) {
      setError("Please select a return date for round trips.");
      return false;
    }
    return true;
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('/flightsearch-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        pt: { xs: 6, md: 10 },
        pb: { xs: 6, md: 10 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box textAlign="center" sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            fontSize: { xs: "28px", sm: "36px", md: "64px" },
            mb: 1,
            color: "#fff",
            textShadow: "0 1px 6px rgba(0,0,0,0.3)",
          }}
        >
          Find Your Perfect Flight
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "14px", md: "18px" },
            color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}
        >
          Book flights, hotels, and complete travel packages at the best prices.
          Your journey starts here.
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "30px",
          width: "100%",
          maxWidth: "1200px",
          p: { xs: 3, sm: 4, md: 5 },
          boxShadow: 6,
        }}
      >
        <RadioGroup
          row
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          sx={{
            flexWrap: "wrap",
            mb: 4,
            "& .MuiFormControlLabel-root": {
              mr: 4,
              fontWeight: "bold",
            },
          }}
        >
          <FormControlLabel
            value="round"
            control={<Radio color="primary" />}
            label="Round Trip"
          />
          <FormControlLabel
            value="oneway"
            control={<Radio color="primary" />}
            label="One Way"
          />
          <FormControlLabel
            value="multi"
            control={<Radio color="primary" />}
            label="Multi City"
          />
        </RadioGroup>

        <Grid container spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Typography fontWeight={400} mb={1} sx={{ color: "rgba(0, 0, 0, 0.55)" }}>
                From
              </Typography>
              <Autocomplete
                freeSolo
                options={fromOptions}
                getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
                inputValue={fromInputValue}
                onInputChange={(event, newInputValue) => {
                  setFromInputValue(newInputValue);
                  debouncedFromFetch(newInputValue);
                }}
                onChange={(event, value) => {
                  if (value && typeof value !== "string") {
                    setFrom(value.value);
                    setFromInputValue(value.displayText || value.label);
                  }
                }}
                filterOptions={(options) => options}
                loading={isFromLoading}
                noOptionsText="No locations found"
                renderOption={(props, option) => {
                  console.log("Rendering From option:", JSON.stringify(option, null, 2));
                  return (
                    <li
                      {...props}
                      style={{
                        padding: "10px 16px",
                        paddingLeft: option.isChild ? "40px" : "16px",
                        fontWeight: option.isParent ? 600 : 400,
                        backgroundColor: option.isParent ? "#f7f7f7" : "inherit",
                        borderBottom: "1px solid #eee",
                        cursor: option.isParent ? "default" : "pointer",
                        pointerEvents: option.isParent ? "none" : "auto",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: option.isParent ? 600 : 400,
                            color: "text.primary",
                          }}
                        >
                          {option.label}
                        </Typography>
                        {option.isChild && option.distance && (
                          <Typography variant="caption" sx={{ color: "#666", mt: 0.5 }}>
                            {option.distance} from city center
                          </Typography>
                        )}
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="New York (NYC)"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FlightTakeoff />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {isFromLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Typography fontWeight={400} mb={1} sx={{ color: "rgba(0, 0, 0, 0.55)" }}>
                To
              </Typography>
              <Autocomplete
                freeSolo
                options={toOptions}
                getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
                inputValue={toInputValue}
                onInputChange={(event, newInputValue) => {
                  setToInputValue(newInputValue);
                  debouncedToFetch(newInputValue);
                }}
                onChange={(event, value) => {
                  if (value && typeof value !== "string") {
                    setTo(value.value);
                    setToInputValue(value.displayText || value.label);
                  }
                }}
                filterOptions={(options) => options}
                loading={isToLoading}
                noOptionsText="No locations found"
                renderOption={(props, option) => {
                  console.log("Rendering To option:", JSON.stringify(option, null, 2));
                  return (
                    <li
                      {...props}
                      style={{
                        padding: "10px 16px",
                        paddingLeft: option.isChild ? "40px" : "16px",
                        fontWeight: option.isParent ? 600 : 400,
                        backgroundColor: option.isParent ? "#f7f7f7" : "inherit",
                        borderBottom: "1px solid #eee",
                        cursor: option.isParent ? "default" : "pointer",
                        pointerEvents: option.isParent ? "none" : "auto",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: option.isParent ? 600 : 400,
                            color: "text.primary",
                          }}
                        >
                          {option.label}
                        </Typography>
                        {option.isChild && option.distance && (
                          <Typography variant="caption" sx={{ color: "#666", mt: 0.5 }}>
                            {option.distance} from city center
                          </Typography>
                        )}
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Los Angeles (LAX)"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FlightLand />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {isToLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Typography fontWeight={400} mb={1} sx={{ color: "rgba(0, 0, 0, 0.55)" }}>
                Departure
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Typography fontWeight={400} mb={1} sx={{ color: "rgba(0, 0, 0, 0.55)" }}>
                Return
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={tripType === "oneway"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Typography fontWeight={400} mb={1} sx={{ color: "rgba(0, 0, 0, 0.55)" }}>
                Passengers
              </Typography>
              <Select
                fullWidth
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                }
                displayEmpty
                renderValue={(selected) => `${selected} Adult`}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} {num === 1 ? "Adult" : "Passengers"}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ mt: { xs: 2, md: 3 } }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Search />}
              onClick={() => {
                if (!validateInputs()) return;
                navigate("/results", {
                  state: {
                    tripType,
                    from,
                    to,
                    departDate,
                    returnDate,
                    passengers,
                  },
                });
              }}
              sx={{
                bgcolor: "#2c39e8",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                height: "56px",
                borderRadius: "14px",
                ":hover": {
                  bgcolor: "#1f2ac4",
                },
              }}
            >
              Search Flights
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlightSearch;