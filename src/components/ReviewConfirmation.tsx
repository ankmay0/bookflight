import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import axios from "axios";

const ReviewConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { passengers = [], contact = {}, flight } = location.state as any ?? {};

  if (!flight || passengers.length === 0) {
    return (
      <Typography align="center" sx={{ mt: 12, fontWeight: 500, color: "#bbb" }}>
        Missing booking details. Please start again.
      </Typography>
    );
  }

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const raw = flight.flightOffer ?? flight.pricingAdditionalInfo ?? null;
      if (!raw) {
        alert("flightOffer missing – cannot book");
        setLoading(false);
        return;
      }
      const travelers = passengers.map((p: any, idx: number) => ({
        id: (idx + 1).toString(),
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dob,
        gender: p.gender || "MALE",
        email: contact.email,
        phones: [{ deviceType: "MOBILE", countryCallingCode: "91", number: contact.phone }],
        documents: [{
          documentType: "PASSPORT",
          number: p.passport || "UNKNOWN",
          issuanceDate: "2015-07-22",
          expiryDate: "2035-11-30",
          issuanceCountry: "IN",
          validityCountry: "IN",
          nationality: "IN",
          birthPlace: "Delhi",
          issuanceLocation: "Delhi",
          holder: true,
        }],
      }));

      const flightOfferStr = typeof raw === "string" ? raw : JSON.stringify(raw);
      const { data: bookingData } = await axios.post(
        "http://localhost:8080/booking/flight-order",
        { flightOffer: flightOfferStr, travelers }
      );
      navigate("/booking-success", { state: bookingData });
    } catch (err: any) {
      alert(
        `Booking failed: ${err?.response?.data ? JSON.stringify(err.response.data) : err.message}`
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
          borderRadius: 1, // thin radius
          border: "1px solid #eee", // very thin border
          minHeight: 450,
        }}
      >
        {/* Title */}
        <Typography variant="h5" fontWeight={700} align="center" sx={{ mb: { xs: 2, sm: 4 } }}>
          Review & Confirmation
        </Typography>

        {/* Flight */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {flight.trips[0].from} → {flight.trips.at(-1).to}
          </Typography>
          <Typography color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
            {flight.trips.airline} {flight.trips.flightNumber} &bull; {flight.trips.departureTime}
          </Typography>
          <Typography color="primary" fontWeight={700}>
            ₹{flight.totalPrice}{" "}
            <Typography variant="caption" color="text.secondary" fontWeight={400}>/passenger</Typography>
          </Typography>
        </Box>

        {/* Passengers */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Passengers
          </Typography>
          {passengers.map((p: any, idx: number) => (
            <Typography key={idx} sx={{ color: "#555", fontWeight: 500, mb: 0.5 }}>
              {p.title} {p.firstName} {p.lastName}{" "}
              <Typography component="span" variant="caption" color="text.secondary">
                {p.dob}
              </Typography>
            </Typography>
          ))}
        </Box>

        {/* Contact */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Contact
          </Typography>
          <Typography color="text.secondary" fontSize={15}>
            {contact.email}
          </Typography>
          <Typography color="text.secondary" fontSize={15}>
            {contact.phone}
          </Typography>
        </Box>

        {/* Total */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Total
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
            ':hover': { background: "#243455" },
          }}
        >
          {loading ? (
            <Typography>Confirming…</Typography>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default ReviewConfirmation;
