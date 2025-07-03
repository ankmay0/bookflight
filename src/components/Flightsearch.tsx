import React, { useState } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FlightTakeoff,
  FlightLand,
  CalendarToday,
  Person,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FlightSearch: React.FC = () => {
  const [tripType, setTripType] = useState("round");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const navigate = useNavigate();

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
    {/* Header */}
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

    {/* White Container */}
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
      {/* Radio Buttons */}
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

      {/* Form Fields */}
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={2.4}>
          <Typography fontWeight={400} mb={1} sx={{ color: "rgba(0, 0, 0, 0.55)" }}>
            From
          </Typography>
          <TextField
            placeholder="New York (NYC)"
            fullWidth
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightTakeoff />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Typography fontWeight={400} mb={1} sx={{ color: "rgba(0, 0, 0, 0.55)" }}>
            To
          </Typography>
          <TextField
            placeholder="Los Angeles (LA)"
            fullWidth
            value={to}
            onChange={(e) => setTo(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightLand />
                </InputAdornment>
              ),
            }}
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

        <Grid xs={12} sx={{ mt: { xs: 2, md: 3 } }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Search />}
            onClick={() => navigate("/results")}  // 🔥 navigate to results page
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
  </Box>
  );
};

export default FlightSearch;
