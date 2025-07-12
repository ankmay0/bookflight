import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const PassengerDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = (location.state as { flight?: any })?.flight;

  const [passengers, setPassengers] = useState([
    { title: "Mr.", firstName: "", lastName: "", dob: "", passport: "" },
  ]);

  const [contact, setContact] = useState({
    email: "",
    phone: "",
  });

  const handlePassengerChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updated = [...passengers];
    updated[index][e.target.name as keyof typeof updated[0]] = e.target.value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { title: "", firstName: "", lastName: "", dob: "", passport: "" },
    ]);
  };

  const removePassenger = (index: number) => {
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    console.log("Passengers:", passengers);
    console.log("Contact Info:", contact);
    console.log("Selected Flight:", flight);
    alert("Booking Confirmed!");
    navigate("/");
  };

  if (!flight) return <Typography>No flight selected. Please go back.</Typography>;

  return (
    <Grid container spacing={3} p={3}>
      {/* Left Passenger Form */}
      <Grid item xs={12} md={8}>
        <Typography variant="h5" gutterBottom>
          Passenger Details
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Please provide passenger information for your flight
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          {passengers.map((passenger, index) => (
            <Box key={index} mb={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">
                  Passenger {index + 1} {index === 0 && "(Primary)"}
                </Typography>
                {index > 0 && (
                  <IconButton onClick={() => removePassenger(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={2}>
                  <TextField
                    select
                    label="Title"
                    name="title"
                    value={passenger.title}
                    onChange={(e) => handlePassengerChange(index, e)}
                    fullWidth
                  >
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={passenger.dob}
                    onChange={(e) => handlePassengerChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Passport Number (optional)"
                    name="passport"
                    value={passenger.passport}
                    onChange={(e) => handlePassengerChange(index, e)}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {index !== passengers.length - 1 && <Divider sx={{ mt: 3 }} />}
            </Box>
          ))}

          <Button variant="outlined" onClick={addPassenger}>
            + Add Passenger
          </Button>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                name="email"
                value={contact.email}
                onChange={handleContactChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phone"
                value={contact.phone}
                onChange={handleContactChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Right Booking Summary */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Booking Summary
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Outbound Flight</strong>
          </Typography>
          <Typography variant="body2">
            {flight.trips[0].from} → {flight.trips[flight.trips.length - 1].to}
          </Typography>
          <Typography variant="body2">
            {flight.trips[0].airline} {flight.trips[0].flightNumber}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Departure: {flight.trips[0].departureTime}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2">
            Passengers: {passengers.length}
          </Typography>
          <Typography variant="body2">
            Price per Passenger: ₹{flight.totalPrice}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" fontWeight="bold">
            Total: ₹{(parseFloat(flight.totalPrice) * passengers.length).toFixed(2)}
          </Typography>

          <Box sx={{ mt: "auto", pt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConfirm}
              disabled={!contact.email || !contact.phone}
            >
              Continue to Payment
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PassengerDetails;
