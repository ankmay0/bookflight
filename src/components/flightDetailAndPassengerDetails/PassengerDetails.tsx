import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import FlightDetails from "../flightDetailAndPassengerDetails/FlightDetials";
import PassengerForm from "../flightDetailAndPassengerDetails/PassangerForm";
import CancellationPolicy from "./CancellationPolicy";
import ImportantNotice from "./ImportantNotice";

const PassengerDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
   const { flight, passengers } = location.state as { flight?: any; passengers?: number };

  if (!flight) return <Typography>No flight selected. Please go back.</Typography>;

  return (
    <Grid container spacing={3} p={3}>
      <PassengerForm flight={flight} passengersNumber={passengers} navigate={navigate} />
      <FlightDetails flight={flight} />
      <CancellationPolicy flight={flight}/>
      <ImportantNotice flight={flight} />
    </Grid>
  );
};

export default PassengerDetails;
