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
  Stack,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Flight } from "../Types/FlightTypes";

interface PassengerFormProps {
  flight: Flight;
  navigate: any;
  passengersNumber?: number;
}

const countryCodes = [
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+91", label: "India (+91)" },
  { code: "+86", label: "China (+86)" },
  { code: "+81", label: "Japan (+81)" },
];

const formatPrice = (price: string | number): string => {
  const priceValue = typeof price === "number" ? price : parseFloat(price) || 0;
  return `₹${priceValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getCityName = (airportCode: string | undefined): string => {
  const airportCityMap: { [key: string]: string } = {
    EWR: "Newark",
    JFK: "New York",
    LGA: "New York",
    LAX: "Los Angeles",
    ORD: "Chicago",
    ATL: "Atlanta",
    DFW: "Dallas",
    SFO: "San Francisco",
    SEA: "Seattle",
    BOS: "Boston",
    DEL: "Delhi",
    BOM: "Mumbai",
    BLR: "Bengaluru",
    MAA: "Chennai",
    HYD: "Hyderabad",
    CCU: "Kolkata",
    DXB: "Dubai",
    PDX: "Portland",
  };
  return airportCode ? airportCityMap[airportCode.toUpperCase()] || airportCode : "Unknown";
};

const PassengerForm: React.FC<PassengerFormProps> = ({
  flight,
  navigate,
  passengersNumber,
}) => {
  const [passengers, setPassengers] = useState([
    { title: "Mr.", firstName: "", lastName: "", dob: "", gender: "", passport: "" },
  ]);
  const [contact, setContact] = useState({ email: "", phone: "", countryCode: "+1" });
  const [errors, setErrors] = useState({
    passengers: [{ firstName: "", lastName: "", dob: "", gender: "" }],
    contact: { email: "", phone: "", countryCode: "" },
  });

  useEffect(() => {
    if (passengersNumber && passengersNumber > 1) {
      const initialPassengers = Array.from({ length: passengersNumber }, () => ({
        title: "Mr.",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        passport: "",
      }));
      setPassengers(initialPassengers);
      setErrors({
        passengers: Array.from({ length: passengersNumber }, () => ({
          firstName: "",
          lastName: "",
          dob: "",
          gender: "",
        })),
        contact: { email: "", phone: "", countryCode: "" },
      });
    }
  }, [passengersNumber]);

  const validatePassenger = (passenger: any) => {
    const newErrors = { firstName: "", lastName: "", dob: "", gender: "" };
    if (!passenger.firstName) newErrors.firstName = "First name is required";
    if (!passenger.lastName) newErrors.lastName = "Last name is required";
    if (!passenger.dob) newErrors.dob = "Date of birth is required";
    if (!passenger.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const validateContact = () => {
    const newErrors = { email: "", phone: "", countryCode: "" };
    if (!contact.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(contact.email))
      newErrors.email = "Invalid email format";
    if (!contact.phone) newErrors.phone = "Phone number is required";
    if (!contact.countryCode) newErrors.countryCode = "Country code is required";
    return newErrors;
  };

  const handlePassengerChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const updated = [...passengers];
    updated[index][e.target.name as keyof typeof updated[0]] = e.target.value;
    setPassengers(updated);

    const newErrors = [...errors.passengers];
    newErrors[index] = validatePassenger(updated[index]);
    setErrors((prev) => ({ ...prev, passengers: newErrors }));
  };

  const addPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      { title: "Mr.", firstName: "", lastName: "", dob: "", gender: "", passport: "" },
    ]);
    setErrors((prev) => ({
      ...prev,
      passengers: [...prev.passengers, { firstName: "", lastName: "", dob: "", gender: "" }],
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

  const handleCountryCodeChange = (value: string) => {
    setContact({ ...contact, countryCode: value });
    const newErrors = validateContact();
    setErrors((prev) => ({ ...prev, contact: newErrors }));
  };

  const handleConfirm = () => {
    const passengerErrors = passengers.map((p) => validatePassenger(p));
    const contactErrors = validateContact();
    setErrors({ passengers: passengerErrors, contact: contactErrors });

    const hasErrors =
      passengerErrors.some((p) => p.firstName || p.lastName || p.dob || p.gender) ||
      contactErrors.email ||
      contactErrors.phone ||
      contactErrors.countryCode;

    if (!hasErrors) {
      navigate("/review-confirmation", {
        state: { passengers, contact, flight },
      });
    }
  };

  // Enhanced price calculation with error handling
  const totalPricePerTraveler = parseFloat(flight.totalPrice) || 0;
  const basePricePerTraveler = parseFloat(flight.basePrice) || 0;
  const taxesAndFees = (totalPricePerTraveler - basePricePerTraveler).toFixed(2);
  const totalPrice = (totalPricePerTraveler * passengers.length).toFixed(2);

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  const calculateFlightDuration = (legs: any[]) => {
    const dep = new Date(legs[0].departureDateTime).getTime();
    const arr = new Date(legs[legs.length - 1].arrivalDateTime).getTime();
    const minutes = Math.round((arr - dep) / 60000);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f4f6f8",
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
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Traveler Details
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please provide details for all travelers as shown on their passports
            </Typography>

            {passengers.map((passenger, index) => (
              <Box
                key={index}
                mb={4}
                sx={{ borderBottom: "1px solid #e0e0e0", pb: 2 }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
                  >
                    Traveler {index + 1} {index === 0 && "(Primary Contact)"}
                  </Typography>
                  {index > 0 && (
                    <IconButton
                      onClick={() => removePassenger(index)}
                      aria-label="Remove traveler"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <FormControl
                      fullWidth
                      error={!!errors.passengers[index].firstName}
                    >
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
                        <MenuItem value="Dr.">Dr.</MenuItem>
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
                    <FormControl
                      fullWidth
                      error={!!errors.passengers[index].gender}
                    >
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, e as any)}
                        sx={{ borderRadius: 1 }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      {!!errors.passengers[index].gender && (
                        <Typography variant="caption" color="error">
                          {errors.passengers[index].gender}
                        </Typography>
                      )}
                    </FormControl>
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
                  <Grid item xs={12}>
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

            {passengers.length < (passengersNumber || 9) && (
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={addPassenger}
                sx={{ mb: 3, textTransform: "none", borderRadius: 1 }}
              >
                Add Another Traveler
              </Button>
            )}

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 2, fontSize: { xs: "1.2rem", md: "1.5rem" } }}
            >
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={countryCodes}
                  getOptionLabel={(option) => option.label}
                  value={countryCodes.find((c) => c.code === contact.countryCode) || null}
                  onChange={(_, value) => handleCountryCodeChange(value?.code || "+1")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country Code"
                      error={!!errors.contact.countryCode}
                      helperText={errors.contact.countryCode}
                      InputProps={{
                        ...params.InputProps,
                        sx: { borderRadius: 1 },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
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

        {/* Flight Summary Section */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 2, fontSize: { xs: "1.2rem", md: "1.5rem" } }}
            >
              Flight Summary
            </Typography>

            {flight.trips.map((trip, index) => (
              <Box key={index} mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ mb: 1, color: "primary.main" }}
                >
                  {index === 0 ? "Outbound" : "Return"} Flight
                </Typography>
                {trip.legs.map((leg, legIndex) => (
                  <Box key={legIndex} display="flex" alignItems="center" mb={1}>
                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                      <Box>
                        {legIndex === 0 ? (
                          <FlightTakeoffIcon sx={{ color: "text.secondary" }} />
                        ) : (
                          <FlightLandIcon sx={{ color: "text.secondary" }} />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {formatTime(leg.departureDateTime)} - {formatTime(leg.arrivalDateTime)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getCityName(leg.departureAirport)} ({leg.departureAirport}) →{" "}
                          {getCityName(leg.arrivalAirport)} ({leg.arrivalAirport}) ·{" "}
                          {formatDate(leg.departureDateTime)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
                <Box display="flex" alignItems="center" mt={1}>
                  <ScheduleIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    Duration: {calculateFlightDuration(trip.legs)}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 1, color: "primary.main" }}
            >
              Price Details
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                Base Price ({passengers.length} Traveler{passengers.length > 1 ? "s" : ""})
              </Typography>
              <Typography variant="body2">{formatPrice(basePricePerTraveler)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Taxes & Fees</Typography>
              <Typography variant="body2">{formatPrice(taxesAndFees)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2" fontWeight={600}>
                Price per Traveler
              </Typography>
              <Typography variant="subtitle2" fontWeight={600}>
                {formatPrice(totalPricePerTraveler)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="subtitle1" fontWeight={600}>
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                {formatPrice(totalPrice)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleConfirm}
              disabled={totalPricePerTraveler <= 0}
              sx={{
                textTransform: "none",
                fontSize: 16,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
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