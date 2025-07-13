import React from "react";
import { Paper, Typography, Stack, Divider, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FlightIcon from "@mui/icons-material/Flight";

interface ImportantNoticeProps {
  flight: any;
}

const ImportantNotice: React.FC<ImportantNoticeProps> = ({ flight }) => {
  const fromAirport = flight.trips[0].from;
  const toAirport = flight.trips[flight.trips.length - 1].to;
  const airline = flight.trips[0].airline;

  return (
    <Paper sx={{ p: 3, mb: 3 , ml : 3, width: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <InfoIcon color="warning" />
        <Typography variant="h6" fontWeight="bold">
          Important Information
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" gutterBottom>
        <strong>Your flight</strong> with {airline} departs from <strong>{fromAirport}</strong> and arrives at <strong>{toAirport}</strong>. Please confirm all transit points and connections before your journey.
      </Typography>

      <Box my={2}>
        <Typography variant="body2" gutterBottom>
          <strong>Nearby Airport Notice:<br /></strong> Your departure is from <strong>{fromAirport}</strong>, which is near the major airport hub. Kindly verify alternate route options.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Your arrival is at <strong>{toAirport}</strong>, which may differ from your originally searched airport. Confirm your final destination before travel.
        </Typography>
      </Box>

      <Typography variant="body2" gutterBottom>
        <strong>Visa & Travel Requirements:<br /></strong> Passengers on tourist or visit visas must carry confirmed return tickets and proof of accommodation. Passport must be valid for a minimum of 6 months from departure.
      </Typography>

      <Typography variant="body2" gutterBottom>
        Baggage dimensions and restricted items apply as per airline rules. Check {airline}'s official site for full baggage regulations.
      </Typography>
      <br />

      <Typography variant="body2" gutterBottom>
        <strong>Unaccompanied Minors (UMNR): <br /></strong> Children under 18 traveling alone may need prior clearance, forms, and extra charges from the airline.
      </Typography>
      <br />

      <Typography variant="body2" gutterBottom>
        <strong>Fast Track Immigration (FTI-TTP):<br /></strong> Available for Indian nationals and OCI cardholders. Visit mha.gov.in for details.
      </Typography>
      <br />

      <Typography variant="body2" gutterBottom>
        Make sure to carry printed copies of your visa; soft copies aren’t accepted at immigration.
      </Typography>

      <Typography variant="body2" gutterBottom color="error">
        Travelers are responsible for ensuring eligibility to enter destination/transit countries. Check all regulations before departure.
      </Typography>
    </Paper>
  );
};

export default ImportantNotice;
