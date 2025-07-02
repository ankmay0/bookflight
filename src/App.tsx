import React from "react";
import Footer from "./components/Footer"; // adjust the path as necessary
import Navbar from "./components/Navbar";
import FlightSearch from "./components/Flightsearch"; // adjust the path as necessary

const App = () => {
  return (
    <div>
      {/* Other content */}
      <Navbar />
      <FlightSearch />
      {/* Other content */}
      <Footer />
    </div>
    
  );
};

export default App;
