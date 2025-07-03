import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FlightSearch from "./components/Flightsearch";
import FlightSearchResults from "./components/FlightSearchResults/FlightSearchResults";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FlightSearch />} />
        <Route path="/results" element={<FlightSearchResults />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
