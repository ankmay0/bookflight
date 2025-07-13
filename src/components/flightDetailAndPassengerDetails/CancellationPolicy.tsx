import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Link,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface CancellationPolicyProps {
  flight: any;
  currencySymbol?: string;
}

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({
  flight,
  currencySymbol = "₹",
}) => {
  const departureDateTime = flight.trips[0].legs[0].departureDateTime;
  const departureDate = new Date(departureDateTime);
  const cutOffDate = new Date(departureDate);
  cutOffDate.setDate(cutOffDate.getDate() - 1);

  // Penalty values
  const lowPenalty = 1015;
  const highPenalty = 23624;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }) +
    " " +
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <Paper sx={{ p: 3, mb: 3, width: "100%" , ml : 3 }} elevation={3} >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Cancellation & Date Change Policy
        </Typography>
        <Link href="#" underline="hover" color="primary">
          View Policy
        </Link>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Airline & Route */}
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <img
          src={flight.trips[0].airlineLogo}
          alt="Airline"
          style={{ height: 16 }}
        />
        <Typography variant="body2" fontWeight="bold">
          {flight.trips[0].from} - {flight.trips[flight.trips.length - 1].to}
        </Typography>
      </Stack>

      {/* Penalty Range */}
      <Box mt={2} position="relative">
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1" fontWeight="bold">
            {currencySymbol} {lowPenalty.toLocaleString()}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {currencySymbol} {highPenalty.toLocaleString()}
          </Typography>
        </Stack>

        {/* Gradient Line */}
        <Box
          sx={{
            height: 8,
            borderRadius: 5,
            background:
              "linear-gradient(to right, #2e7d32, #ffa000, #c62828)",
            my: 1,
          }}
        />

        {/* Cut-Off Time Marker */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {formatDate(cutOffDate)}
          </Typography>
          <Box
            sx={{
              width: 1,
              height: 20,
              backgroundColor: "#ccc",
              margin: "2px auto 0 auto",
            }}
          />
        </Box>
      </Box>

      {/* Time Info */}
      <Stack direction="row" spacing={1} alignItems="center" mt={2}>
        <AccessTimeIcon fontSize="small" color="warning" />
        <Typography variant="body2" fontWeight="bold">
          The timings mentioned above are in Indian Standard Time (IST)
        </Typography>
      </Stack>
    </Paper>
  );
};

export default CancellationPolicy;
