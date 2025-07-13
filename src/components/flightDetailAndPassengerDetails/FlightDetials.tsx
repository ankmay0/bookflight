import React from "react";
import {
  Box, Typography, Grid, Paper, Stack, Chip
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LuggageIcon from "@mui/icons-material/Luggage";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import TvIcon from "@mui/icons-material/Tv";
import PowerIcon from "@mui/icons-material/Power";

interface FlightDetailsProps {
  flight: any;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flight }) => {
  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {flight.trips[0].from} → {flight.trips[flight.trips.length - 1].to}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {new Date(flight.trips[0].legs[0].departureDateTime).toLocaleDateString([], {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}{" "}
          • {flight.trips[0].stops} stop{flight.trips[0].stops !== 1 ? "s" : ""} •{" "}
          {flight.trips[0].totalFlightDuration}
        </Typography>

        {flight.trips.map((trip: any, tripIdx: number) => (
          <Box key={tripIdx} mb={2}>
            {trip.legs.map((leg: any, legIdx: number) => (
              <Box key={legIdx} sx={{ borderBottom: 1, borderColor: "#e0e0e0", pb: 1, mb: 2 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} md={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FlightTakeoffIcon color="primary" />
                      <Typography variant="body2" fontWeight="bold">
                        {leg.operatingCarrierCode} {leg.flightNumber}
                      </Typography>
                      <Chip label={leg.aircraftCode} size="small" />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography fontWeight="bold">
                      {new Date(leg.departureDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <Typography>
                      ({leg.departureAirport}
                      {leg.departureTerminal && `, T${leg.departureTerminal}`})
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography>{leg.duration}</Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography fontWeight="bold">
                      {new Date(leg.arrivalDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <Typography>
                      ({leg.arrivalAirport}
                      {leg.arrivalTerminal && `, T${leg.arrivalTerminal}`})
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography color="text.secondary">Economy Basic</Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Stack direction="row" spacing={0.5}>
                      <WifiIcon fontSize="small" />
                      <LocalDiningIcon fontSize="small" />
                      <TvIcon fontSize="small" />
                      <PowerIcon fontSize="small" />
                    </Stack>
                  </Grid>
                </Grid>
                <Box display="flex" gap={3} mt={1}>
                  <Stack direction="row" spacing={0.5}>
                    <LuggageIcon fontSize="small" />
                    <Typography variant="body2">Cabin: 8 kg / Adult</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <LuggageIcon fontSize="small" />
                    <Typography variant="body2">Check-in: 23 kg / Adult</Typography>
                  </Stack>
                </Box>
              </Box>
            ))}
            {trip.totalLayoverDuration && trip.totalLayoverDuration !== "0h 0m" && (
              <Typography color="error" variant="body2" mb={2}>
                Change of planes • Layover: {trip.totalLayoverDuration}
              </Typography>
            )}
          </Box>
        ))}
      </Paper>
    </Grid>
  );
};

export default FlightDetails;
