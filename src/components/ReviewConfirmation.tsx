import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  Grid,
  Stack,
  Container
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";

const ReviewConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { passengers, contact, flight } = location.state as any;

  if (!passengers || !contact || !flight) {
    return <Typography>Missing booking details. Please start again.</Typography>;
  }

  return (
    <Box bgcolor="#f5f7fa" minHeight="100vh" py={4}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom fontWeight={600} textAlign="center">
          ✈️ Review & Confirm Booking
        </Typography>

        {/* Flight Summary */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #d0d7de" }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <FlightTakeoffIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Flight Summary
            </Typography>
          </Stack>
          <Typography>
            <strong>{flight.trips[0].from}</strong> → <strong>{flight.trips[flight.trips.length - 1].to}</strong>
          </Typography>
          <Typography>
            {flight.trips[0].airline} {flight.trips[0].flightNumber}
          </Typography>
          <Typography>Departure: {flight.trips[0].departureTime}</Typography>
          <Typography mt={1} color="primary.main" fontWeight={500}>
            ₹{flight.totalPrice} per passenger
          </Typography>
        </Paper>

        {/* Passenger Details */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #d0d7de" }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <AirlineSeatReclineNormalIcon color="secondary" />
            <Typography variant="h6" fontWeight={600}>
              Passenger Details
            </Typography>
          </Stack>

          {passengers.map((p: any, idx: number) => (
            <Box key={idx} mb={2}>
              <Typography fontWeight={600}>
                <PersonIcon sx={{ fontSize: 18, mr: 0.5, mb: "-3px" }} />
                {p.title} {p.firstName} {p.lastName}
              </Typography>
              <Typography variant="body2">DOB: {p.dob}</Typography>
              {p.passport && (
                <Typography variant="body2">Passport: {p.passport}</Typography>
              )}
              {idx !== passengers.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Paper>

        {/* Contact Info */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #d0d7de" }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Typography variant="h6" fontWeight={600}>
              📞 Contact Information
            </Typography>
          </Stack>
          <Typography>
            <EmailIcon sx={{ fontSize: 18, mr: 0.5, mb: "-3px" }} />
            {contact.email}
          </Typography>
          <Typography>
            <PhoneIcon sx={{ fontSize: 18, mr: 0.5, mb: "-3px" }} />
            {contact.phone}
          </Typography>
        </Paper>

        {/* Total */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            bgcolor: "#e0f2f1",
            border: "1px solid #b2dfdb"
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            💸 Total Amount
          </Typography>
          <Typography variant="h5" color="primary.main" fontWeight={700} mt={1}>
            ₹{(parseFloat(flight.totalPrice) * passengers.length).toFixed(2)}
          </Typography>
        </Paper>

        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none"
          }}
          onClick={() => {
            alert("🎉 Booking Confirmed!");
            navigate("/");
          }}
        >
          Confirm Booking
        </Button>
      </Container>
    </Box>
  );
};

export default ReviewConfirmation;
