import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Grid,
  TextField,
  Divider,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon,
  Schedule as ScheduleIcon,
  Luggage as LuggageIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CreditCard as CreditCardIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";

const ReviewConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [expandedFlight, setExpandedFlight] = useState<number | null>(0);
  const { passengers = [], contact = {}, flight } = location.state ?? {};

  // Payment state
  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  if (!flight || passengers.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CheckCircleIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Missing Booking Details
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Please return to the search page and start your booking again.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          Back to Search
        </Button>
      </Container>
    );
  }

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ").slice(0, 19) : digits;
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      setPayment({ ...payment, [name]: formatCardNumber(value) });
    } else if (name === "cvv") {
      setPayment({ ...payment, [name]: value.replace(/\D/g, "").slice(0, 4) });
    } else {
      setPayment({ ...payment, [name]: value });
    }
  };

  const validatePayment = () => {
    const errors = { cardName: "", cardNumber: "", expiry: "", cvv: "" };
    let isValid = true;

    if (!payment.cardName.trim()) {
      errors.cardName = "Cardholder name is required";
      isValid = false;
    }

    const cleanCardNumber = payment.cardNumber.replace(/\s/g, "");
    if (!cleanCardNumber || cleanCardNumber.length !== 16 || !/^\d{16}$/.test(cleanCardNumber)) {
      errors.cardNumber = "Valid 16-digit card number is required";
      isValid = false;
    }

    if (!payment.expiryMonth || !payment.expiryYear) {
      errors.expiry = "Expiry date is required";
      isValid = false;
    } else {
      const expiryDate = new Date(parseInt(payment.expiryYear) + 2000, parseInt(payment.expiryMonth) - 1);
      if (expiryDate < new Date()) {
        errors.expiry = "Card has expired";
        isValid = false;
      }
    }

    if (!payment.cvv || (payment.cvv.length < 3 || payment.cvv.length > 4) || !/^\d+$/.test(payment.cvv)) {
      errors.cvv = "Valid CVV (3-4 digits) required";
      isValid = false;
    }

    setPaymentErrors(errors);
    return isValid;
  };

  const handleConfirmBooking = async () => {
    if (!termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    if (!validatePayment()) {
      setError("Please correct the payment details");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const flightOffer = flight.flightOffer || flight.pricingAdditionalInfo;
      if (!flightOffer) {
        throw new Error("Flight offer data is missing");
      }

      const travelers = passengers.map((p: any, idx: number) => {
        const traveler = {
          id: (idx + 1).toString(),
          title: p.title,
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dob,
          gender: p.gender.toUpperCase(),
          phones: [],
        } as any;

        if (idx === 0) {
          traveler.phones = [
            {
              deviceType: "MOBILE",
              countryCallingCode: contact.countryCode.replace("+", ""),
              number: contact.phone,
            },
          ];
          traveler.email = contact.email;
        }

        if (p.passport) {
          traveler.documents = [
            {
              documentType: "PASSPORT",
              number: p.passport,
              issuanceDate: "2020-01-01",
              expiryDate: "2030-01-01",
              issuanceCountry: "IN",
              validityCountry: "IN",
              nationality: "IN",
              birthPlace: "Unknown",
              issuanceLocation: "Unknown",
              holder: true,
            },
          ];
        }

        return traveler;
      });

      const paymentDetails = {
        type: "credit_card",
        name: payment.cardName,
        number: payment.cardNumber.replace(/\s/g, ""),
        expiry: `${payment.expiryMonth}/${payment.expiryYear}`,
        cvv: payment.cvv,
      };

      const flightOfferStr = typeof flightOffer === "string" ? flightOffer : JSON.stringify(flightOffer);
      const { data: bookingData } = await axios.post(
        "http://localhost:8080/booking/flight-order",
        { flightOffer: flightOfferStr, travelers, payment: paymentDetails }
      );
      
      navigate("/booking-success", { 
        state: { 
          bookingData,
          passengers,
          contact,
          flight 
        }
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Booking failed. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const total = (parseFloat(flight.totalPrice) * passengers.length);
  const baseFare = parseFloat(flight.basePrice) * passengers.length;
  const taxes = total - baseFare;

  const handleFlightExpand = (tripIndex: number) => {
    setExpandedFlight(expandedFlight === tripIndex ? null : tripIndex);
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="lg">

        <Typography variant="h4" fontWeight={700} color="primary" sx={{ mb: 4, textAlign: "center" }}>
          Review Your Booking
        </Typography>

        <Grid container spacing={3}>
          {/* Main Content: Traveler, Contact, and Payment */}
          <Grid item xs={12} md={7}>
            <Card elevation={0} sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: "none", color: "primary.main" }}
                  >
                    Edit Booking
                  </Button>
                </Box>

                {/* Travelers Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Traveler Details
                  </Typography>
                  <List>
                    {passengers.map((p: any, idx: number) => (
                      <ListItem
                        key={idx}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          bgcolor: idx === 0 ? "primary.light" : "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${p.title} ${p.firstName} ${p.lastName}`}
                          secondary={
                            <>
                              <Typography variant="body2" component="span" display="block">
                                DOB: {p.dob} • {p.gender}
                              </Typography>
                              {p.passport && (
                                <Typography variant="body2" component="span" display="block">
                                  Passport: {p.passport}
                                </Typography>
                              )}
                              {idx === 0 && (
                                <Chip
                                  label="Primary Contact"
                                  size="small"
                                  color="primary"
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Contact Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Contact Information
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center">
                        <EmailIcon color="primary" sx={{ mr: 2 }} />
                        <Typography>{contact.email}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <PhoneIcon color="primary" sx={{ mr: 2 }} />
                        <Typography>
                          {contact.countryCode} {contact.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Payment Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Payment Method
                  </Typography>
                  <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Stack spacing={3}>
                      <TextField
                        label="Cardholder Name"
                        name="cardName"
                        value={payment.cardName}
                        onChange={handlePaymentChange}
                        fullWidth
                        required
                        error={!!paymentErrors.cardName}
                        helperText={paymentErrors.cardName}
                        InputProps={{
                          startAdornment: <CreditCardIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />

                      <TextField
                        label="Card Number"
                        name="cardNumber"
                        value={payment.cardNumber}
                        onChange={handlePaymentChange}
                        fullWidth
                        required
                        inputProps={{ maxLength: 19 }}
                        error={!!paymentErrors.cardNumber}
                        helperText={paymentErrors.cardNumber}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl fullWidth error={!!paymentErrors.expiry}>
                            <InputLabel>Expiry Month</InputLabel>
                            <Select
                              name="expiryMonth"
                              value={payment.expiryMonth}
                              onChange={(e) => setPayment({ ...payment, expiryMonth: e.target.value as string })}
                              label="Expiry Month"
                            >
                              {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                                  {(i + 1).toString().padStart(2, "0")}
                                </MenuItem>
                              ))}
                            </Select>
                            {!!paymentErrors.expiry && <FormHelperText>{paymentErrors.expiry}</FormHelperText>}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth error={!!paymentErrors.expiry}>
                            <InputLabel>Expiry Year</InputLabel>
                            <Select
                              name="expiryYear"
                              value={payment.expiryYear}
                              onChange={(e) => setPayment({ ...payment, expiryYear: e.target.value as string })}
                              label="Expiry Year"
                            >
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = (new Date().getFullYear() + i).toString().slice(2);
                                return <MenuItem key={year} value={year}>{year}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <TextField
                        label="CVV"
                        name="cvv"
                        value={payment.cvv}
                        onChange={handlePaymentChange}
                        fullWidth
                        required
                        inputProps={{ maxLength: 4 }}
                        error={!!paymentErrors.cvv}
                        helperText={paymentErrors.cvv}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            I agree to the{" "}
                            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>
                              terms and conditions
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>
                              privacy policy
                            </a>
                          </Typography>
                        }
                      />
                    </Stack>
                  </Card>
                </Box>

                {/* Complete Booking Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleConfirmBooking}
                  disabled={loading || !termsAccepted}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  {loading ? "Processing..." : "Complete Booking"}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar: Flight Details and Price */}
          <Grid item xs={12} md={5}>
            <Card elevation={0} sx={{ borderRadius: 3, position: "sticky", top: 20 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
                  Your Flight Itinerary
                </Typography>

                {flight.trips.map((trip: any, tripIdx: number) => (
                  <Box key={tripIdx} sx={{ mb: 3 }}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2,
                        borderColor: expandedFlight === tripIdx ? "primary.main" : "divider",
                        boxShadow: expandedFlight === tripIdx ? "0 0 0 1px #1976d2" : "none",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box 
                          display="flex" 
                          justifyContent="space-between" 
                          alignItems="center"
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleFlightExpand(tripIdx)}
                        >
                          <Box>
                            <Typography fontWeight={600}>
                              {tripIdx === 0 ? "Departure" : "Return"} Flight
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(trip.legs[0].departureDateTime), "EEE, MMM d, yyyy")}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            {expandedFlight === tripIdx ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>

                        <Collapse in={expandedFlight === tripIdx}>
                          <Box sx={{ mt: 2 }}>
                            {trip.legs.map((leg: any, legIdx: number) => (
                              <Box key={legIdx} sx={{ mb: 3 }}>
                                <Box display="flex" alignItems="center" mb={1.5}>
                                  <Avatar 
                                    src={`https://content.airhex.com/content/logos/airlines_${leg.operatingCarrierCode}_50_50_r.png`}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                  />
                                  <Typography fontWeight={600}>
                                    {leg.operatingCarrierCode} {leg.flightNumber}
                                  </Typography>
                                  <Chip
                                    label={leg.aircraftCode}
                                    size="small"
                                    sx={{ ml: 1 }}
                                  />
                                </Box>

                                <Grid container spacing={1} sx={{ mb: 1 }}>
                                  <Grid item xs={5}>
                                    <Typography fontWeight={500}>
                                      {format(new Date(leg.departureDateTime), "h:mm a")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {leg.departureAirport}
                                    </Typography>
                                    {leg.departureTerminal && (
                                      <Typography variant="caption" color="text.secondary">
                                        Terminal {leg.departureTerminal}
                                      </Typography>
                                    )}
                                  </Grid>
                                  <Grid item xs={2} sx={{ textAlign: "center" }}>
                                    <Box
                                      sx={{
                                        width: "100%",
                                        height: "1px",
                                        backgroundColor: "#bdbdbd",
                                        position: "relative",
                                        top: "12px",
                                        "&:before, &:after": {
                                          content: '""',
                                          display: "block",
                                          width: 8,
                                          height: 8,
                                          backgroundColor: "#bdbdbd",
                                          borderRadius: "50%",
                                          position: "absolute",
                                          top: -4,
                                        },
                                        "&:before": { left: -4 },
                                        "&:after": { right: -4 },
                                      }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {leg.duration}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography fontWeight={500}>
                                      {format(new Date(leg.arrivalDateTime), "h:mm a")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {leg.arrivalAirport}
                                    </Typography>
                                    {leg.arrivalTerminal && (
                                      <Typography variant="caption" color="text.secondary">
                                        Terminal {leg.arrivalTerminal}
                                      </Typography>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>
                            ))}

                            {trip.totalLayoverDuration && trip.totalLayoverDuration !== "0h 0m" && (
                              <Box sx={{ 
                                backgroundColor: "#fff8e1", 
                                p: 1.5, 
                                borderRadius: 1, 
                                textAlign: "center",
                                mb: 2 
                              }}>
                                <Typography variant="body2" color="text.secondary">
                                  Layover: {trip.totalLayoverDuration}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  </Box>
                ))}

                <Divider sx={{ my: 3 }} />

                {/* Baggage Information */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Baggage Allowance
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center">
                      <LuggageIcon color="action" sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="body2">Cabin baggage</Typography>
                        <Typography variant="body2" color="text.secondary">
                          1 piece (max 8 kg)
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <LuggageIcon color="action" sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="body2">Checked baggage</Typography>
                        <Typography variant="body2" color="text.secondary">
                          1 piece (max 23 kg)
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Price Summary */}
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Price Summary
                  </Typography>
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Base Fare ({passengers.length} {passengers.length > 1 ? "travelers" : "traveler"})</Typography>
                      <Typography variant="body2">₹{baseFare.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Taxes & Fees</Typography>
                      <Typography variant="body2">₹{taxes.toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Total Amount
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="primary">
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ReviewConfirmation;