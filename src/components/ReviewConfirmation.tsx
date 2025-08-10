import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const ReviewConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { passengers = [], contact = {}, flight } = location.state ?? {};

  if (!flight || passengers.length === 0) {
    return (
      <Typography align="center" sx={{ mt: 12, fontWeight: 500, color: "text.secondary" }}>
        Missing booking details. Please start again.
      </Typography>
    );
  }

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const flightOffer = flight.flightOffer ?? flight.pricingAdditionalInfo;
      if (!flightOffer) {
        setError("Flight offer data is missing. Please try again.");
        setLoading(false);
        return;
      }

      const travelers = passengers.map((p: any, idx: number) => {
        const traveler = {
          id: (idx + 1).toString(),
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dob,
          gender: p.gender.toUpperCase(), // Map "Male" to "MALE", "Female" to "FEMALE", etc.
        } as any;

        // Assign contact info only to primary traveler (index 0)
        if (idx === 0) {
          traveler.email = contact.email;
          traveler.phones = [
            {
              deviceType: "MOBILE",
              countryCallingCode: contact.countryCode.replace("+", ""), // Remove "+" from country code
              number: contact.phone,
            },
          ];
        }

        // Include passport only if provided
        if (p.passport) {
          traveler.documents = [
            {
              documentType: "PASSPORT",
              number: p.passport,
              // Avoid hardcoding; these should come from user input or API defaults
              issuanceDate: "2020-01-01", // Placeholder; ideally collect from form
              expiryDate: "2030-01-01", // Placeholder
              issuanceCountry: "IN", // Placeholder
              validityCountry: "IN", // Placeholder
              nationality: "IN", // Placeholder
              birthPlace: "Unknown", // Placeholder
              issuanceLocation: "Unknown", // Placeholder
              holder: true,
            },
          ];
        }

        return traveler;
      });

      const flightOfferStr = typeof flightOffer === "string" ? flightOffer : JSON.stringify(flightOffer);
      const { data: bookingData } = await axios.post(
        "http://localhost:8080/booking/flight-order",
        { flightOffer: flightOfferStr, travelers }
      );
      navigate("/booking-success", { state: bookingData });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Booking failed. Please try again or contact support."
      );
      setLoading(false);
    }
  };

  const total = (parseFloat(flight.totalPrice) * passengers.length).toFixed(2);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 8 } }}>
      <Box
        sx={{
          maxWidth: 420,
          mx: "auto",
          p: { xs: 2, sm: 4 },
          background: "#fff",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
          minHeight: 450,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" fontWeight={700} align="center" sx={{ mb: { xs: 2, sm: 4 } }}>
          Review & Book
        </Typography>

        {/* Flight */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {flight.trips[0].from} → {flight.trips[flight.trips.length - 1].to}
          </Typography>
          <Typography color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
            {flight.trips[0].legs[0].operatingCarrierCode} {flight.trips[0].legs[0].flightNumber} •{" "}
            {new Date(flight.trips[0].legs[0].departureDateTime).toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            • {flight.trips[0].stops} stop{flight.trips[0].stops !== 1 ? "s" : ""}
          </Typography>
          <Typography color="primary" fontWeight={700}>
            ₹{flight.totalPrice}{" "}
            <Typography component="span" variant="caption" color="text.secondary" fontWeight={400}>
              /traveler
            </Typography>
          </Typography>
        </Box>

        {/* Passengers */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Travelers
          </Typography>
          {passengers.map((p: any, idx: number) => (
            <Typography key={idx} sx={{ color: "#555", fontWeight: 500, mb: 0.5 }}>
              {p.title} {p.firstName} {p.lastName}{" "}
              <Typography component="span" variant="caption" color="text.secondary">
                {p.dob} • {p.gender}
              </Typography>
            </Typography>
          ))}
        </Box>

        {/* Contact */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Contact Information
          </Typography>
          <Typography color="text.secondary" fontSize={15}>
            {contact.email}
          </Typography>
          <Typography color="text.secondary" fontSize={15}>
            {contact.countryCode} {contact.phone}
          </Typography>
        </Box>

        {/* Total */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Total ({passengers.length} traveler{passengers.length !== 1 ? "s" : ""})
          </Typography>
          <Typography variant="h6" color="primary" fontWeight={700}>
            ₹{total}
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleConfirmBooking}
          disabled={loading}
          sx={{
            mt: 2,
            borderRadius: 2.5,
            height: 48,
            fontWeight: 700,
            boxShadow: "none",
            background: "#30476e",
            "&:hover": { background: "#243455" },
          }}
        >
          {loading ? "Confirming…" : "Confirm Booking"}
        </Button>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReviewConfirmation;