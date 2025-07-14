import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FlightSearch from "./components/Flightsearch";
import FlightSearchResults from "./components/FlightSearchResults/FlightSearchResults";
import PassengerDetails from "./components/flightDetailAndPassengerDetails/PassengerDetails"; 
import ReviewConfirmation from "./components/ReviewConfirmation";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FlightSearch />} />
        <Route path="/results" element={<FlightSearchResults />} />
        <Route path="/passenger-details" element={<PassengerDetails />} /> 
        <Route path="/review-confirmation" element={<ReviewConfirmation />} />

      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
