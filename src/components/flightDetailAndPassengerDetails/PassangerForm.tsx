import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

interface PassengerFormProps {
  flight: any;
  navigate: any;
  passengersNumber?: number;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ flight, navigate, passengersNumber }) => {
  const [passengers, setPassengers] = useState([
    { title: "Mr.", firstName: "", lastName: "", dob: "", passport: "" },
  ]);
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [errors, setErrors] = useState({
    passengers: [{ firstName: "", lastName: "", dob: "" }],
    contact: { email: "", phone: "" },
  });

  useEffect(() => {
    if (passengersNumber && passengersNumber > 1) {
      const initialPassengers = Array.from({ length: passengersNumber }, () => ({
        title: "Mr.",
        firstName: "",
        lastName: "",
        dob: "",
        passport: "",
      }));
      setPassengers(initialPassengers);
      setErrors({
        passengers: Array.from({ length: passengersNumber }, () => ({
          firstName: "",
          lastName: "",
          dob: "",
        })),
        contact: { email: "", phone: "" },
      });
    }
  }, [passengersNumber]);

  const validatePassenger = (passenger: any, index: number) => {
    const newErrors = { firstName: "", lastName: "", dob: "" };
    if (!passenger.firstName) newErrors.firstName = "First name is required";
    if (!passenger.lastName) newErrors.lastName = "Last name is required";
    if (!passenger.dob) newErrors.dob = "Date of birth is required";
    return newErrors;
  };

  const validateContact = () => {
    const newErrors = { email: "", phone: "" };
    if (!contact.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(contact.email)) newErrors.email = "Invalid email format";
    if (!contact.phone) newErrors.phone = "Phone number is required";
    return newErrors;
  };

  const handlePassengerChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updated = [...passengers];
    updated[index][e.target.name as keyof typeof updated[0]] = e.target.value;
    setPassengers(updated);

    const newErrors = [...errors.passengers];
    newErrors[index] = validatePassenger(updated[index], index);
    setErrors((prev) => ({ ...prev, passengers: newErrors }));
  };

  const addPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      { title: "Mr.", firstName: "", lastName: "", dob: "", passport: "" },
    ]);
    setErrors((prev) => ({
      ...prev,
      passengers: [...prev.passengers, { firstName: "", lastName: "", dob: "" }],
    }));
  };

  const removePassenger = (index: number) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({
      ...prev,
      passengers: prev.passengers.filter((_, i) => i !== index),
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
    const newErrors = validateContact();
    setErrors((prev) => ({ ...prev, contact: newErrors }));
  };

  const handleConfirm = () => {
    const passengerErrors = passengers.map((p, i) => validatePassenger(p, i));
    const contactErrors = validateContact();
    setErrors({ passengers: passengerErrors, contact: contactErrors });

    const hasErrors = passengerErrors.some(
      (p) => p.firstName || p.lastName || p.dob
    ) || contactErrors.email || contactErrors.phone;

    if (!hasErrors) {
      navigate("/review-confirmation", {
        state: { passengers, contact, flight },
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f5f7fa",
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={3} sx={{ maxWidth: 1200, width: "100%" }}>
        {/* Passenger Form Section */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              color="primary"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Passenger Details
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Enter details for all passengers traveling on this flight
            </Typography>

            {passengers.map((passenger, index) => (
              <Box key={index} mb={4} sx={{ borderBottom: "1px solid #e0e0e0", pb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={500} sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
                    Passenger {index + 1} {index === 0 && "(Primary Contact)"}
                  </Typography>
                  {index > 0 && (
                    <IconButton
                      onClick={() => removePassenger(index)}
                      aria-label="Remove passenger"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth error={!!errors.passengers[index].firstName}>
                      <InputLabel>Title</InputLabel>
                      <Select
                        name="title"
                        value={passenger.title}
                        onChange={(e) => handlePassengerChange(index, e as any)}
                        sx={{ borderRadius: 1 }}
                      >
                        <MenuItem value="Mr.">Mr.</MenuItem>
                        <MenuItem value="Ms.">Ms.</MenuItem>
                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={passenger.firstName}
                      onChange={(e) => handlePassengerChange(index, e)}
                      fullWidth
                      required
                      error={!!errors.passengers[index].firstName}
                      helperText={errors.passengers[index].firstName}
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
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
                      error={!!errors.passengers[index].lastName}
                      helperText={errors.passengers[index].lastName}
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
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
                      error={!!errors.passengers[index].dob}
                      helperText={errors.passengers[index].dob}
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Passport Number (Optional)"
                      name="passport"
                      value={passenger.passport}
                      onChange={(e) => handlePassengerChange(index, e)}
                      fullWidth
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={addPassenger}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                fontSize: "1rem",
                py: 1,
                "&:hover": { bgcolor: "primary.light", color: "primary.contrastText" },
              }}
            >
              Add Another Passenger
            </Button>
          </Paper>

          {/* Contact Info */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              mt: 3,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={500}
              color="primary"
              gutterBottom
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
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
                  error={!!errors.contact.email}
                  helperText={errors.contact.email}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    sx: { borderRadius: 1 },
                  }}
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
                  error={!!errors.contact.phone}
                  helperText={errors.contact.phone}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    sx: { borderRadius: 1 },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Booking Summary Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ position: { md: "sticky" }, top: { md: 20 }, alignSelf: { md: "flex-start" } }}
        >
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              bgcolor: "#fff",
              height: { xs: "auto", md: "calc(100vh - 40px)" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary"
              gutterBottom
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              Booking Summary
            </Typography>
            <Box mb={2} sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                <FlightTakeoffIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Outbound Flight
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.trips[0].from} → {flight.trips[flight.trips.length - 1].to}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.trips[0].airline} {flight.trips[0].flightNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Departure: {flight.trips[0].departureTime}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                Passengers: {passengers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price per Passenger: ₹{parseFloat(flight.totalPrice).toFixed(2)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight={600}>
                Total: ₹{(parseFloat(flight.totalPrice) * passengers.length).toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConfirm}
              disabled={
                passengers.some((p) => !p.firstName || !p.lastName || !p.dob) ||
                !contact.email ||
                !contact.phone ||
                !!errors.contact.email ||
                !!errors.contact.phone
              }
              sx={{
                borderRadius: 1,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
              }}
            >
              Continue to Payment
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PassengerForm;