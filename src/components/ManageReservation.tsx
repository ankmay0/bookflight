import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

interface Traveler {
  id: string;
  dateOfBirth: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phones: {
    deviceType: string;
    countryCallingCode: string;
    number: string;
  }[];
  documents: {
    number: string;
    expiryDate: string;
    issuanceCountry: string;
    nationality: string;
    documentType: string;
    holder: boolean;
  }[];
}

interface Leg {
  legNo: string;
  flightNumber: string;
  operatingCarrierCode: string;
  aircraftCode: string;
  departureAirport: string;
  departureTerminal: string;
  departureDateTime: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  arrivalDateTime: string;
  duration: string;
  layoverAfter: string | null;
}

interface Trip {
  from: string;
  to: string;
  stops: number;
  totalFlightDuration: string;
  totalLayoverDuration: string;
  legs: Leg[];
}

interface BookingData {
  orderId: string;
  travelers: Traveler[];
  flightOffer: {
    oneWay: boolean;
    seatsAvailable: number;
    currencyCode: string;
    basePrice: string;
    totalPrice: string;
    totalTravelers: number;
    trips: Trip[];
    pricingAdditionalInfo: string | null;
  };
}

const ManageReservation: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [error, setError] = useState('');

  const formatDateTime = (dateTime: string) => {
    const dateObj = new Date(dateTime);
    return dateObj.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    setError('');
    setBookingData(null);

    try {
      const encodedId = encodeURIComponent(searchText);
      const res = await fetch(`http://localhost:8080/booking/flight-order/${encodedId}`);
      if (!res.ok) throw new Error('Failed to fetch booking');
      const data: BookingData = await res.json();
      setBookingData(data);
    } catch (err) {
      setError('Could not fetch booking details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f8fa', p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1} color="primary">
        Manage Your Booking
      </Typography>
      <Typography variant="body1" textAlign="center" mb={4} color="text.secondary">
        View your itinerary, passenger details, and flight information.
      </Typography>

      {/* Search Card */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Booking ID"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: '100%' }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}

      {bookingData && (
        <Box maxWidth={1000} mx="auto">
          {/* Booking Summary */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4, backgroundColor: 'white' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Booking Summary
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <Typography>
                <AttachMoneyIcon fontSize="small" /> {bookingData.flightOffer.currencyCode} {bookingData.flightOffer.totalPrice}
              </Typography>
              <Typography>
                <AirlineSeatReclineNormalIcon fontSize="small" /> Travelers: {bookingData.flightOffer.totalTravelers}
              </Typography>
              <Typography>Order ID: {bookingData.orderId}</Typography>
            </Stack>
          </Paper>

          {/* Passenger Info */}
          {/* Passenger Info */}
          {/* Passenger Info */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Passenger Information
          </Typography>

          <Card elevation={1} sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent>
              {bookingData.travelers.map((traveler, index) => (
                <React.Fragment key={traveler.id}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">
                        {traveler.firstName} {traveler.lastName} ({traveler.gender})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth: {traveler.dateOfBirth}
                      </Typography>
                    </Box>
                  </Stack>

                  <Grid container spacing={2} mb={1}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">
                        <strong>Phone:</strong> +{traveler.phones[0]?.countryCallingCode} {traveler.phones[0]?.number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">
                        <strong>Document:</strong> {traveler.documents[0]?.documentType} — {traveler.documents[0]?.number}
                      </Typography>
                    </Grid>
                  </Grid>

                  {index < bookingData.travelers.length - 1 && <Divider sx={{ my: 2 }} />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>




          {/* Flight Itinerary */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Flight Itinerary
          </Typography>
          {bookingData.flightOffer.trips.map((trip, idx) => (
            <Card key={idx} elevation={1} sx={{ borderRadius: 2, mb: 3, p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                {trip.from} → {trip.to} | Duration: {trip.totalFlightDuration}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {trip.legs.map((leg) => (
                <Box key={leg.legNo} sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FlightTakeoffIcon color="primary" />
                    <Typography>
                      Depart: {leg.departureAirport} T{leg.departureTerminal} — {formatDateTime(leg.departureDateTime)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FlightLandIcon color="secondary" />
                    <Typography>
                      Arrive: {leg.arrivalAirport} T{leg.arrivalTerminal} — {formatDateTime(leg.arrivalDateTime)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ManageReservation;
