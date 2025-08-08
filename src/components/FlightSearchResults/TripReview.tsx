import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Flight } from "../Types/FlightTypes";

// Utility functions (you can import these from your existing files)
const getAirlineName = (code: string) => {
  const airlinesData: { [key: string]: { name: string; icon: string } } = {
    DL: { name: "Delta Air Lines", icon: "https://content.airhex.com/content/logos/airlines_DL_75_75_s.png" },
  AA: { name: "American Airlines", icon: "https://content.airhex.com/content/logos/airlines_AA_75_75_s.png" },
  UA: { name: "United Airlines", icon: "https://content.airhex.com/content/logos/airlines_UA_75_75_s.png" },
  WN: { name: "Southwest Airlines", icon: "https://content.airhex.com/content/logos/airlines_WN_75_75_s.png" },
  B6: { name: "JetBlue Airways", icon: "https://content.airhex.com/content/logos/airlines_B6_75_75_s.png" },
  NK: { name: "Spirit Airlines", icon: "https://content.airhex.com/content/logos/airlines_NK_75_75_s.png" },
  F9: { name: "Frontier Airlines", icon: "https://content.airhex.com/content/logos/airlines_F9_75_75_s.png" },
  AI: { name: "Air India", icon: "https://content.airhex.com/content/logos/airlines_AI_75_75_s.png" },
  "6E": { name: "IndiGo", icon: "https://content.airhex.com/content/logos/airlines_6E_75_75_s.png" },
  SG: { name: "SpiceJet", icon: "https://content.airhex.com/content/logos/airlines_SG_75_75_s.png" },
  UK: { name: "Vistara", icon: "https://content.airhex.com/content/logos/airlines_UK_75_75_s.png" },
    // Add more as needed
  };
  return airlinesData[code]?.name || code;
};

const getAirlineIconURL = (code: string) => {
  const airlinesData: { [key: string]: { name: string; icon: string } } = {
 DL: { name: "Delta Air Lines", icon: "https://content.airhex.com/content/logos/airlines_DL_75_75_s.png" },
  AA: { name: "American Airlines", icon: "https://content.airhex.com/content/logos/airlines_AA_75_75_s.png" },
  UA: { name: "United Airlines", icon: "https://content.airhex.com/content/logos/airlines_UA_75_75_s.png" },
  WN: { name: "Southwest Airlines", icon: "https://content.airhex.com/content/logos/airlines_WN_75_75_s.png" },
  B6: { name: "JetBlue Airways", icon: "https://content.airhex.com/content/logos/airlines_B6_75_75_s.png" },
  NK: { name: "Spirit Airlines", icon: "https://content.airhex.com/content/logos/airlines_NK_75_75_s.png" },
  F9: { name: "Frontier Airlines", icon: "https://content.airhex.com/content/logos/airlines_F9_75_75_s.png" },
  AI: { name: "Air India", icon: "https://content.airhex.com/content/logos/airlines_AI_75_75_s.png" },
  "6E": { name: "IndiGo", icon: "https://content.airhex.com/content/logos/airlines_6E_75_75_s.png" },
  SG: { name: "SpiceJet", icon: "https://content.airhex.com/content/logos/airlines_SG_75_75_s.png" },
  UK: { name: "Vistara", icon: "https://content.airhex.com/content/logos/airlines_UK_75_75_s.png" },
    // Add more as needed
  };
  return airlinesData[code]?.icon || `https://content.airhex.com/content/logos/airlines_${code}_75_75_s.png`;
};

const formatPrice = (price: string | number) => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num || 0);
};

const mapStopsToLabel = (stops: number | undefined) => {
  if (stops === 0) return "Direct";
  if (stops === 1) return "1 stop";
  if (stops && stops > 1) return `${stops} stops`;
  return "Multiple stops";
};

interface TripReviewProps {
  departureFlight: Flight;
  returnFlight: Flight;
  passengers: number;
  from: string;
  to: string;
  fromDetails: any;
  toDetails: any;
  onBack: () => void;
  onConfirm: () => void;
}

const TripReview: React.FC<TripReviewProps> = ({
  departureFlight,
  returnFlight,
  passengers,
  from,
  to,
  fromDetails,
  toDetails,
  onBack,
  onConfirm,
}) => {
  const departureLeg = departureFlight.trips[0].legs[0];
  const returnLeg = returnFlight.trips[1].legs[0];
  
  const totalPrice = parseFloat(departureFlight.totalPrice) + parseFloat(returnFlight.totalPrice);
  
  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 4, 
      borderRadius: 3, 
      border: "1px solid", 
      borderColor: "divider",
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Review Your Trip
      </Typography>
      
      {/* Flight Summary Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>
          Flight Summary
        </Typography>
        
        {/* Outbound Flight */}
        <Box sx={{ mb: 3 }}>
          <Typography fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>Outbound Flight</span>
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>
              {fromDetails?.city || from} to {toDetails?.city || to}
            </span>
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <img 
              src={getAirlineIconURL(departureLeg.operatingCarrierCode)} 
              alt={getAirlineName(departureLeg.operatingCarrierCode)}
              width={48}
              height={48}
              style={{ borderRadius: '50%' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                {getAirlineName(departureLeg.operatingCarrierCode)} · {departureLeg.flightNumber}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  {formatDateTime(departureLeg.departureDateTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mapStopsToLabel(departureFlight.trips[0].stops)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Duration: {Math.floor(calculateFlightDuration(departureFlight) / 60)}h {calculateFlightDuration(departureFlight) % 60}m
              </Typography>
            </Box>
            <Typography fontWeight={700} sx={{ minWidth: '100px', textAlign: 'right' }}>
              {formatPrice(departureFlight.totalPrice)}
            </Typography>
          </Box>
        </Box>
        
        {/* Return Flight */}
        <Box sx={{ mb: 2 }}>
          <Typography fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>Return Flight</span>
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>
              {toDetails?.city || to} to {fromDetails?.city || from}
            </span>
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <img 
              src={getAirlineIconURL(returnLeg.operatingCarrierCode)} 
              alt={getAirlineName(returnLeg.operatingCarrierCode)}
              width={48}
              height={48}
              style={{ borderRadius: '50%' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                {getAirlineName(returnLeg.operatingCarrierCode)} · {returnLeg.flightNumber}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  {formatDateTime(returnLeg.departureDateTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mapStopsToLabel(returnFlight.trips[1].stops)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Duration: {Math.floor(calculateFlightDuration(returnFlight) / 60)}h {calculateFlightDuration(returnFlight) % 60}m
              </Typography>
            </Box>
            <Typography fontWeight={700} sx={{ minWidth: '100px', textAlign: 'right' }}>
              {formatPrice(returnFlight.totalPrice)}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Passenger Info */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>
          Passenger Information
        </Typography>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'grey.50', 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography>
            {passengers} Passenger{passengers !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Price Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>
          Price Summary
        </Typography>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'grey.50', 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Outbound Flight:</Typography>
            <Typography>{formatPrice(departureFlight.totalPrice)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Return Flight:</Typography>
            <Typography>{formatPrice(returnFlight.totalPrice)}</Typography>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={600}>Total:</Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {formatPrice(totalPrice)}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
          sx={{ 
            minWidth: '200px',
            textTransform: 'none',
            fontWeight: 500,
            py: 1.5
          }}
          fullWidth={false}
        >
          Back to Flight Selection
        </Button>
        <Button 
          variant="contained"
          onClick={onConfirm}
          sx={{ 
            minWidth: '200px',
            textTransform: 'none',
            fontWeight: 500,
            py: 1.5
          }}
          fullWidth={false}
        >
          Continue to Passenger Details
        </Button>
      </Box>
    </Paper>
  );
};

// Helper function to calculate flight duration (should be imported from utilities)
const calculateFlightDuration = (flight: Flight): number => {
  if (!flight.trips?.[0]?.legs) return 0;
  const legs = flight.trips[0].legs;
  const first = legs[0], last = legs[legs.length - 1];
  if (!first?.departureDateTime || !last?.arrivalDateTime) return 0;
  return Math.floor(
    (new Date(last.arrivalDateTime).getTime() - new Date(first.departureDateTime).getTime()) / 60000
  );
};

export default TripReview;