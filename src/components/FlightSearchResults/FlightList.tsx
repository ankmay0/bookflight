import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Divider from "@mui/material/Divider";
import Lottie from "lottie-react";
import SidebarFilters from "./SidebarFilters";
import { Flight } from "../Types/FlightTypes";

interface FlightListProps {
  loading: boolean;
  lottieJson: any;
  filteredFlights: Flight[];
  selectedDepartureFlight: Flight | null;
  from: string;
  to: string;
  showFilters: boolean;
  handleDepartureSelect: (flight: Flight) => void;
  handleConfirmSelection: (flight: Flight) => void;
  mapStopsToLabel: (stops: number | undefined) => string;
  priceRange: number[];
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTimes: string[];
  setSelectedTimes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStops: string[];
  setSelectedStops: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAirlines: string[];
  setSelectedAirlines: React.Dispatch<React.SetStateAction<string[]>>;
  availableStops: string[];
  availableAirlines: string[];
  minPrice: number;
  maxPrice: number;
  setSelectedDepartureFlight: React.Dispatch<React.SetStateAction<Flight | null>>;
}

const FlightList: React.FC<FlightListProps> = ({
  loading,
  lottieJson,
  filteredFlights,
  selectedDepartureFlight,
  from,
  to,
  showFilters,
  handleDepartureSelect,
  handleConfirmSelection,
  mapStopsToLabel,
  priceRange,
  setPriceRange,
  selectedTimes,
  setSelectedTimes,
  selectedStops,
  setSelectedStops,
  selectedAirlines,
  setSelectedAirlines,
  availableStops,
  availableAirlines,
  minPrice,
  maxPrice,
  setSelectedDepartureFlight,
}) => {
  const departureFlights = filteredFlights.filter(
    (flight) => flight.trips[0]?.from === from && flight.trips[0]?.to === to
  );
  const returnFlights = selectedDepartureFlight
    ? filteredFlights.filter(
        (flight) => flight.trips[1]?.from === to && flight.trips[1]?.to === from
      )
    : [];

  return (
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
          lottieJson ? (
            <Lottie
              animationData={lottieJson}
              style={{ height: 200, width: 200, margin: "0 auto" }}
              loop
              autoplay
            />
          ) : (
            <CircularProgress />
          )
        ) : !selectedDepartureFlight ? (
          <Stack spacing={3}>
            <Typography variant="h6">Select Departure Flight</Typography>
            {departureFlights.length === 0 ? (
              <Typography>No departure flights found.</Typography>
            ) : (
              departureFlights.map((flight, idx) => (
                <Paper
                  key={idx}
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    p: 3,
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AirplanemodeActiveIcon />
                        {flight.trips?.[0]?.legs?.[0]?.operatingCarrierCode || ""}{" "}
                        {flight.trips?.[0]?.legs?.[0]?.flightNumber || ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mapStopsToLabel(flight.trips?.[0]?.stops)} | ₹{flight.totalPrice}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleDepartureSelect(flight)}
                      >
                        Select Departure
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    {flight.trips[0].legs.map((leg, lIdx) => (
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        key={lIdx}
                        sx={{ mb: 1 }}
                      >
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <FlightTakeoffIcon fontSize="small" sx={{ mr: 1 }} />
                            <strong>
                              {new Date(leg.departureDateTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>{" "}
                            ({leg.departureAirport})
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <FlightLandIcon fontSize="small" sx={{ mr: 1 }} />
                            <strong>
                              {new Date(leg.arrivalDateTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>{" "}
                            ({leg.arrivalAirport})
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                            {leg.duration}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                            Aircraft: {leg.aircraftCode}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </Paper>
              ))
            )}
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Typography variant="h6">Selected Departure Flight</Typography>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                p: 3,
                backgroundColor: "#e3f2fd",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <AirplanemodeActiveIcon />
                    {selectedDepartureFlight.trips?.[0]?.legs?.[0]?.operatingCarrierCode || ""}{" "}
                    {selectedDepartureFlight.trips?.[0]?.legs?.[0]?.flightNumber || ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mapStopsToLabel(selectedDepartureFlight.trips?.[0]?.stops)} | ₹
                    {selectedDepartureFlight.totalPrice}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedDepartureFlight(null)}
                  >
                    Change Departure
                  </Button>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Box>
                {selectedDepartureFlight.trips[0].legs.map((leg, lIdx) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    key={lIdx}
                    sx={{ mb: 1 }}
                  >
                    <Grid item xs={12} md={3}>
                      <Typography>
                        <FlightTakeoffIcon fontSize="small" sx={{ mr: 1 }} />
                        <strong>
                          {new Date(leg.departureDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>{" "}
                        ({leg.departureAirport})
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography>
                        <FlightLandIcon fontSize="small" sx={{ mr: 1 }} />
                        <strong>
                          {new Date(leg.arrivalDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>{" "}
                        ({leg.arrivalAirport})
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        {leg.duration}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography>
                        <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                        Aircraft: {leg.aircraftCode}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Paper>
            <Typography variant="h6">Select Return Flight</Typography>
            {returnFlights.length === 0 ? (
              <Typography>No return flights found.</Typography>
            ) : (
              returnFlights.map((flight, idx) => (
                <Paper
                  key={idx}
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    p: 3,
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AirplanemodeActiveIcon />
                        {flight.trips?.[1]?.legs?.[0]?.operatingCarrierCode || ""}{" "}
                        {flight.trips?.[1]?.legs?.[0]?.flightNumber || ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mapStopsToLabel(flight.trips?.[1]?.stops)} | ₹{flight.totalPrice}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleConfirmSelection(flight)}
                      >
                        Select Return
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    {flight.trips[1].legs.map((leg, lIdx) => (
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        key={lIdx}
                        sx={{ mb: 1 }}
                      >
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <FlightTakeoffIcon fontSize="small" sx={{ mr: 1 }} />
                            <strong>
                              {new Date(leg.departureDateTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>{" "}
                            ({leg.departureAirport})
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <FlightLandIcon fontSize="small" sx={{ mr: 1 }} />
                            <strong>
                              {new Date(leg.arrivalDateTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>{" "}
                            ({leg.arrivalAirport})
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                            {leg.duration}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography>
                            <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                            Aircraft: {leg.aircraftCode}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </Paper>
              ))
            )}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};

export default FlightList;